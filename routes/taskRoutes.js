const express = require('express');
const multer = require('multer');
const verifyToken = require('../middlewares/authMiddleware')
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

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // batasan ukuran file 10MB
});

router.post('/', verifyToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'items' }
]), createTask);
router.put('/:id', verifyToken, updateTask);
router.put('/:id/items', verifyToken, toggleItemStatus);
router.delete('/:id', verifyToken, deleteTask);
router.get('/', verifyToken, listTask);
router.get('/:id', verifyToken, detailTask);

module.exports = router; 