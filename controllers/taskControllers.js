const crypto = require('crypto');
const { bucket, storage } = require('../config/cloudStorage');
const firestore = require('../config/firestore')

exports.createTask = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    const { title, startDate, finishDate, location, description } = req.body;
    const id = crypto.randomUUID();

    const blob = bucket.file(`taskImage/${id}_${image.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false
    });

    blobStream.on('error', (err) => {
      console.error('Upload Error:', err);
      res.status(500).json({ message: 'An error occurred while uploading the file' });
    });

    blobStream.on('finish', async () => {
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const items = Array.isArray(req.body.items) ? req.body.items.map(name => ({ name, checked: false })) : [];

      const newTask = {
        id: id,
        title: title,
        image: imageUrl,
        startDate: new Date(startDate).toISOString(),
        finishDate: new Date(finishDate).toISOString(),
        location: location,
        description: description,
        items: items,
        createdAt: createdAt,
        updatedAt: updatedAt
      };

      // Simpan ke Firestore
      await firestore.collection('tasks').doc(id).set(newTask);
      res.status(201).json(newTask);
    });

    blobStream.end(image.buffer);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'An error occurred while uploading the file' });
  }
};


exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, startDate, finishDate, location, description, items } = req.body;

  const updatedAt = new Date().toISOString();

  try {
    const taskRef = firestore.collection('tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log(title);
    // Create an update object with only defined properties
    const updateObject = {
      updatedAt,
      ...(title !== undefined && { title : title }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(finishDate !== undefined && { finishDate: new Date(finishDate) }),
      ...(location !== undefined && { location }),
      ...(description !== undefined && { description }),
      ...(items !== undefined && { items: items.map(name => ({ name, checked: false })) })
    };

    await taskRef.update(updateObject);

    res.status(200).json({
      message: 'Task updated successfully',
      value: updateObject,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

exports.toggleItemStatus = async (req, res) => {
  const { id, itemName } = req.params;

  try {
    const taskRef = firestore.collection('tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = doc.data();
    const itemIndex = task.items.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    task.items[itemIndex].checked = !task.items[itemIndex].checked;
    task.updatedAt = new Date().toISOString();

    await taskRef.update({
      items: task.items,
      updatedAt: task.updatedAt
    });

    res.status(200).json(task);
  } catch (error) {
    console.error('Error toggling item status:', error);
    res.status(500).json({ message: 'An error occurred while changing the item status.' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await firestore.collection('tasks').doc(id).delete();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'An error occurred while deleting the task' });
  }
};

exports.listTask = async (req, res) => {
  try {
    const snapshot = await firestore.collection('tasks').get();
    const listedTask = [];

    snapshot.forEach(doc => {
      const task = doc.data();
      listedTask.push({
        id: task.id,
        title: task.title,
        image: task.image,
        startDate: new Date(task.startDate),
        finishDate: new Date(task.finishDate),
        location: task.location,
        items: task.items.length
      });
    });

    res.status(200).json(listedTask);
  } catch (error) {
    console.error('Error listing tasks:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the task list' });
  }
};

exports.detailTask = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await firestore.collection('tasks').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = doc.data();
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ message: 'An error occurred while retrieving task details' });
  }
};
