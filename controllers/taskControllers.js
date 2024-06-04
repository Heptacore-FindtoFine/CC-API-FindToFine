const crypto = require('crypto');

let tasks = [];

exports.createTask = async (req, res) => {
  const { title, location, description, item } = req.body;
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  
  const newTask = {
    id,
    title,
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
  const { title, location, description, item } = req.body;
  const editedAt = new Date().toISOString();
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks[index] = {
    ...tasks[index],
    title,
    location,
    description,
    item,
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
    title: task.title,
    location: task.location,
    updatedAt: task.updatedAt
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
