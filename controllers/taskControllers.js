const crypto = require('crypto');
const axios = require('axios');
const { bucket } = require('../config/cloudStorage');
const { db } = require('../config/firebase');

// Fungsi untuk memanggil API FastAPI
const getPrediction = async (imageUrl) => {
  try {
    const response = await axios.post('https://ml-model-api-izoaerx5sa-et.a.run.app/predict', { image_url: imageUrl });
    return response.data.predicted_class;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to get prediction');
  }
};

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, startDate, finishDate, location, description } = req.body;

    const id = crypto.randomUUID();

    // Fungsi untuk mengupload gambar ke bucket
    const uploadImage = async (file, path) => {
      return new Promise((resolve, reject) => {
        const blob = bucket.file(`${path}/${id}_${file.originalname}`);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on('error', reject);

        blobStream.on('finish', () => {
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(imageUrl);
        });

        blobStream.end(file.buffer);
      });
    };

    // Upload image thumbnail
    const imageUrl = await uploadImage(req.files.image[0], 'taskImage');

    // Upload item images
    const itemImages = await Promise.all(
      req.files.items.map(file => uploadImage(file, 'itemImages'))
    );

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const itemsArray = await Promise.all(itemImages.map(async (imageUrl) => {
      const predictedClass = await getPrediction(imageUrl);
      return { image: imageUrl, name: predictedClass, checked: false };
    }));

    const newTask = {
      id: id,
      title: title,
      image: imageUrl,
      startDate: new Date(startDate).toISOString(),
      finishDate: new Date(finishDate).toISOString(),
      location: location,
      description: description,
      items: itemsArray,
      createdAt: createdAt,
      updatedAt: updatedAt
    };

    // Simpan ke Firestore
    await db.collection('users').doc(userId).collection('tasks').doc(id).set(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'An error occurred while creating the task' });
  }
};

exports.updateTask = async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;
  const { title, startDate, finishDate, location, description, items, createdAt } = req.body;

  const updatedAt = new Date().toISOString();

  try {
    const taskRef = db.collection('users').doc(userId).collection('tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Mengambil data task yang ada untuk mempertahankan image dan checked
    const existingTask = doc.data();

    // Create an update object with only defined properties
    const updateObject = {
      ...(title !== undefined && { title: title }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(finishDate !== undefined && { finishDate: new Date(finishDate) }),
      ...(location !== undefined && { location }),
      ...(description !== undefined && { description }),
      ...(createdAt !== undefined && { createdAt: createdAt }),
      updatedAt
    };

    // Mengupdate items jika disediakan
    if (items !== undefined) {
      const updatedItems = existingTask.items.map(existingItem => {
        const newItem = items.find(item => item.image === existingItem.image);
        if (newItem) {
          return {
            image: existingItem.image,
            name: newItem.name !== undefined ? newItem.name : existingItem.name,
            status: existingItem.status,
          };
        }
        return existingItem;
      });

      updateObject.items = updatedItems;
    }

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
  const userId = req.user.uid;
  const { id } = req.params;
  const { name } = req.body;

  try {
    const taskRef = db.collection('users').doc(userId).collection('tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = doc.data();
    const itemIndex = task.items.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    task.items[itemIndex].checked = !task.items[itemIndex].checked;
    task.updatedAt = new Date().toISOString();

    // Convert Firestore Timestamps to ISO strings
    if (task.startDate && task.startDate.toDate) {
      task.startDate = task.startDate.toDate().toISOString();
    }
    if (task.finishDate && task.finishDate.toDate) {
      task.finishDate = task.finishDate.toDate().toISOString();
    }

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
  const userId = req.user.uid;
  const { id } = req.params;

  try {
    await db.collection('users').doc(userId).collection('tasks').doc(id).delete();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'An error occurred while deleting the task' });
  }
};

exports.listTask = async (req, res) => {
  const userId = req.user.uid;
  try {
    const snapshot = await db.collection('users').doc(userId).collection('tasks').get();
    const listedTask = [];

    snapshot.forEach(doc => {
      const task = doc.data();

      // Convert Firestore Timestamps to ISO strings
      if (task.startDate && task.startDate.toDate) {
        task.startDate = task.startDate.toDate().toISOString();
      }
      if (task.finishDate && task.finishDate.toDate) {
        task.finishDate = task.finishDate.toDate().toISOString();
      }

      listedTask.push({
        id: task.id,
        title: task.title,
        image: task.image,
        startDate: task.startDate,
        finishDate: task.finishDate,
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
  const userId = req.user.uid;
  const { id } = req.params;

  try {
    const doc = await db.collection('users').doc(userId).collection('tasks').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = doc.data();

    // Convert Firestore Timestamps to ISO strings
    if (task.startDate && task.startDate.toDate) {
      task.startDate = task.startDate.toDate().toISOString();
    }
    if (task.finishDate && task.finishDate.toDate) {
      task.finishDate = task.finishDate.toDate().toISOString();
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ message: 'An error occurred while retrieving task details' });
  }
};
