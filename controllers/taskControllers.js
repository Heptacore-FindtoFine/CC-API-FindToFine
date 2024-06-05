const crypto = require('crypto');

let tasks = [];

exports.createTask = async (req, res) => {
  const { title, image, startDate, finishDate, location, description, item } = req.body;
  const id = crypto.randomUUID();

  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newTask = {
    id,
    title,
    image,
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
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, image, startDate, finishDate, duration, location, description, item } = req.body;

  const updatedAt = new Date().toISOString();

  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks[index] = {
    ...tasks[index],
    image,
    title,
    startDate: new Date(startDate),
    finishDate: new Date(finishDate),
    duration,
    location,
    description,
    item,
    createdAt,
    updatedAt
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
    image: task.image,
    startDate: new Date(task.startDate),
    finishDate: new Date(task.finishDate),
    location: task.location
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

