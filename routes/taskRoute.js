const express = require('express');
const path = require('path');
const multer = require('multer');
const { 
  createTask,
  updateTask,
  toggleItemStatus,
  deleteTask,
  listTask,
  detailTask
} = require('../controllers/taskControllers');

const router = express.Router();

// Konfigurasi multer dengan memory storage
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.post('/', upload.single('image'), createTask);
router.put('/:id', updateTask);
router.put('/:id/item/:itemName', toggleItemStatus);
router.delete('/:id', deleteTask);
router.get('/', listTask);
router.get('/:id', detailTask);

module.exports = router; 