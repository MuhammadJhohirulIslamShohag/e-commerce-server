const express = require('express');
const router = express.Router();

// importing controller
const { authController, currentUser } = require('../controllers/auth');

// importing middleware
const {authCheck, adminCheck} = require('../middleware/auth')

router.post("/create-or-update-user", authCheck , authController);

router.post("/current-user", authCheck, currentUser);

router.post("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;