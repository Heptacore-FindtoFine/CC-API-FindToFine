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
    throw new Error('Gagal untuk mendapatkan prediksi');
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

    // Mendefinisikan status task
    const status = false;

    const newTask = {
      id: id,
      title: title,
      image: imageUrl,
      startDate: new Date(startDate).toISOString(),
      finishDate: new Date(finishDate).toISOString(),
      location: location,
      description: description,
      items: itemsArray,
      status: status,
      createdAt: createdAt,
      updatedAt: updatedAt
    };

    // Simpan ke Firestore
    await db.collection('users').doc(userId).collection('tasks').doc(id).set(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error while creating task:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat task' });
  }
};

exports.updateTask = async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;
  const { title, startDate, finishDate, location, description, items, status, createdAt } = req.body;

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
      ...(location !== undefined && { location: location }),
      ...(description !== undefined && { description: description }),
      ...(status !== undefined && { status: status }),
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
    console.error('Error while updating task:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui task' });
  }
};

exports.toggleItemStatus = async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;
  let { name } = req.body;

  // Ensure name is always an array
  if (typeof name === 'string') {
    name = [name];
  } else if (!Array.isArray(name)) {
    return res.status(400).json({ message: 'Name should be a string or an array' });
  }

  try {
    const taskRef = db.collection('users').doc(userId).collection('tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = doc.data();
    let itemUpdated = false;

    name.forEach(itemName => {
      const itemIndex = task.items.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());

      if (itemIndex !== -1) {
        task.items[itemIndex].checked = !task.items[itemIndex].checked;
        itemUpdated = true;
      }
    });

    if (!itemUpdated) {
      return res.status(404).json({ message: 'No items found to update' });
    }

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
    res.status(500).json({ message: 'Terjadi kesalahan saat mengubah status item' });
  }
};

exports.deleteTask = async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;

  try {
    await db.collection('users').doc(userId).collection('tasks').doc(id).delete();
    res.status(200).json({ message: 'Task berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus task' });
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
        items: task.items.length,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      });
    });


    res.status(200).json(listedTask);
  } catch (error) {
    console.error('Error listing tasks:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil daftar task' });
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
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil detail task' });
  }
};
