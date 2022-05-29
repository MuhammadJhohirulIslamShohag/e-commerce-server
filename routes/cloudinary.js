const express = require('express');
const router = express.Router();

// importing middleware
const {authCheck, adminCheck} = require('../middleware/auth');

// importing controller
const {upload, remove} = require('../controllers/cloudinary');


// routes
router.post('/upload-images', authCheck, adminCheck, upload);
router.post('/remove-images', authCheck, adminCheck, remove);

module.exports = router;



