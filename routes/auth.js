const express = require('express');
const router = express.Router();

// importing controller
const { createOrUpdateUser, currentUser } = require('../controllers/auth');

// importing middleware
const {authCheck, adminCheck} = require('../middleware/auth')

router.post("/create-or-update-user", authCheck , createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);
router.post("/admin-user", authCheck, adminCheck, currentUser);

module.exports = router;