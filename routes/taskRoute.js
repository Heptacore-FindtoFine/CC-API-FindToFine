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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), createTask);
router.put('/:id', updateTask);
router.put('/:id/item/:itemName', toggleItemStatus);
router.delete('/:id', deleteTask);
router.get('/', listTask);
router.get('/:id', detailTask);

module.exports = router; 