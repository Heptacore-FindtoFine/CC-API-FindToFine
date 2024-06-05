const express = require('express');
const { 
  createTask,
  updateTask,
  toggleItemStatus,
  deleteTask,
  listTask,
  detailTask
} = require('../controllers/taskControllers');

const router = express.Router();

router.post('/', createTask);
router.put('/:id', updateTask);
router.put('/:id/item/:itemName', toggleItemStatus);
router.delete('/:id', deleteTask);
router.get('/', listTask);
router.get('/:id', detailTask);

module.exports = router; 