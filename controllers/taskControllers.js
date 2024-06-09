const crypto = require('crypto');
const { bucket, storage } = require('../config/cloudStorage');
const multer = require('multer');

let tasks = [];

exports.createTask = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    const { title, startDate, finishDate, location, description, item } = req.body;
    const id = crypto.randomUUID();

    console.log('Image Path:', image.path);
    console.log('Image:', image);
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${image.filename}`;

    // if (!uploadedFile || uploadedFile.length === 0) {
    //   return res.status(404).json({ message: 'File tidak ditemukan' });
    // }

    // const fileId = crypto.randomUUID();
    // const fileName = `${fileId}_${image.originalname}`;
    // const storageFile = bucket.file(fileName);
    // await storageFile.save(image.buffer);
    // const publicUrl = `https://storage.googleapis.com/${bucket.name}/taskImage/${fileName}`;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Inisialisasi status item menjadi false
    const items = item.map(name => ({ name, checked: false }));
    // const imageString = imageBuffer.toString('base64');

    const newTask = {
      'id': id,
      'title': title,
      'image': imageUrl,
      'startDate': new Date(startDate),
      'finishDate': new Date(finishDate),
      'location': location,
      'description': description,
      'items': items,
      'createdAt': createdAt,
      'updatedAt': updatedAt
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    // console.log(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat upload file' });
  };
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, image, startDate, finishDate, location, description, item } = req.body;

  const updatedAt = new Date().toISOString();

  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const updatedItems = item.map(name => ({ name, checked: false }));

  tasks[index] = {
    ...tasks[index],
    image,
    title,
    startDate: new Date(startDate),
    finishDate: new Date(finishDate),
    location,
    description,
    items: updatedItems,
    updatedAt
  };

  res.status(200).json(tasks[index]);

};

exports.toggleItemStatus = async (req, res) => {
  const { id, itemName } = req.params;

  // Mencari tugas dengan ID yang diberikan
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  const task = tasks[taskIndex];

  // Mencari item dengan nama yang cocok
  const itemIndex = task.items.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  const item = task.items[itemIndex];

  // Membalikkan status item
  item.checked = !item.checked;

  // Memperbarui properti updatedAt dari tugas yang terkait
  task.updatedAt = new Date().toISOString();

  // Memperbarui tugas dalam array tasks
  tasks[taskIndex] = task;

  // Mengirim respons dengan tugas yang telah diperbarui
  res.status(200).json(task);
};


exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted successfully' });
};

exports.listTask = async (req, res) => {
  const listedTask = tasks.map(task => ({
    id: task.id,
    title: task.title,
    image: task.image,
    startDate: new Date(task.startDate),
    finishDate: new Date(task.finishDate),
    location: task.location,
    items: task.items
  }));

  res.status(200).json(listedTask);
};

exports.detailTask = async (req, res) => {
  const { id } = req.params;
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json(task);
};
