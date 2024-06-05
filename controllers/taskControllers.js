const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

let tasks = [];

// Konfigurasi Multer untuk menyimpan gambar di folder 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Inisialisasi Multer
const upload = multer({ storage: storage });

exports.createTask = async (req, res) => {
  const { title, startDate, finishDate, location, description, item } = req.body;
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // Gunakan middleware upload Multer untuk mengelola pengunggahan file
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Failed to upload image' });
    }
    
    // Dapatkan path gambar yang diunggah
    const imagePath = req.file ? req.file.path : '';

    const newTask = {
      id,
      title,
      image: imagePath,
      startDate: new Date(startDate),
      finishDate: new Date(finishDate),
      location,
      description,
      item,
      createdAt,
      updatedAt
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, startDate, finishDate, location, description, item } = req.body;
  const editedAt = new Date().toISOString();
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Dapatkan path gambar yang diunggah
  const imagePath = req.file ? req.file.path : tasks[index].image;

  tasks[index] = {
    ...tasks[index],
    title,
    image: imagePath,
    startDate: new Date(startDate),
    finishDate: new Date(finishDate),
    location,
    description,
    item,
    createdAt,
    editedAt
  };
  res.status(200).json(tasks[index]);
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
    startDate: new Date(task.startDate),
    finishDate: new Date(task.finishDate),
    location: task.location,
    image: task.image
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

