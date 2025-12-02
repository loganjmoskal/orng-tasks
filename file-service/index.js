// file-service/index.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// setup storage 
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    // Save as "timestamp-filename" to avoid name collisions
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 } // 10MB
}).single('file'); 

app.use('/uploads', express.static('uploads'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      return res.status(500).json({ error: err.message });
    }
    if(!req.file){
      return res.status(400).json({ error: 'No file selected!' });
    }

    // return the URL 
    const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    res.json({
      message: 'File uploaded!',
      url: fileUrl,
      filename: req.file.originalname
    });
  });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`File Service running on port ${PORT}`));