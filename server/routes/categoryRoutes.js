var express = require('express');
const { create, getCategories, getParentCategories, deleteCategory } = require('../app/controllers/CategoryController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.post('/create', [authMiddleware], create)
router.get('/get', [authMiddleware], getCategories)
router.get('/get_parent_categories', [authMiddleware], getParentCategories)
router.post('/delete', [authMiddleware], deleteCategory)

const categoryRoutes = router
module.exports = categoryRoutes