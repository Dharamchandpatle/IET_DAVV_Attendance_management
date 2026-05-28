const express = require('express');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure upload directory exists at runtime (created by developer).
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safeName);
  }
});

const upload = multer({ storage });

// POST /api/uploads - accepts multipart form files and returns array of URLs
router.post('/', authMiddleware(['student','faculty','admin']), upload.array('files', 10), (req, res) => {
  const files = req.files || [];
  const baseUrl = (req.protocol + '://' + req.get('host'));
  const urls = files.map(f => `${baseUrl}/uploads/${f.filename}`);
  return res.json({ success: true, data: urls });
});

module.exports = router;
