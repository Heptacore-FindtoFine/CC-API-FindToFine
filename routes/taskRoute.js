const express = require('express');
const { 
  createTask,
  updateTask,
  deleteTask,
  listTask,
  detailTask
} = require('../controllers/taskControllers');

const router = express.Router();

router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/', listTask);
router.get('/:id', detailTask);

module.exports = router; 