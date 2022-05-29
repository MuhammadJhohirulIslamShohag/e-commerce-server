const express = require('express');
const router = express.Router();

// importing middleware
const {authCheck, adminCheck} = require('../middleware/auth');

// importing controller
const {create, read, update, remove, list, subCategoryOnCategory} = require('../controllers/category');

// creating category routers
router.post('/category', authCheck, adminCheck, create);
router.get('/categories', list);
router.get('/categories/:slug', read);
router.put('/categories/:slug', authCheck, adminCheck, update);
router.delete('/categories/:slug', authCheck, adminCheck, remove);
router.get('/categories/sub-categories/:_id', authCheck, adminCheck, subCategoryOnCategory);


module.exports = router;