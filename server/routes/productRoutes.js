var express = require('express');
const { create, deleteProduct, getProducts, searchProducts, getProductById } = require('../app/controllers/ProductController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.get('/', [authMiddleware], getProducts)
router.get('/:id', [authMiddleware], getProductById)
router.get('/search/:query/:status', [authMiddleware], searchProducts)
router.post('/create', [authMiddleware], create)
router.post('/delete', [authMiddleware], deleteProduct)

const productRoutes = router
module.exports = productRoutes