const express = require('express');
const router = express.Router();

// importing controller
const { create_or_update_user, current_user } = require('../controllers/auth');

// importing middleware
const {authCheck, adminCheck} = require('../middleware/auth')

router.post("/create-or-update-user", authCheck , create_or_update_user);
router.post("/current-user", authCheck, current_user);
router.post("/admin-user", authCheck, adminCheck, current_user);

module.exports = router;