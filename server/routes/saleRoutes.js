var express = require('express');
const { create, deleteProduct, searchProducts, getInvoices } = require('../app/controllers/SaleController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.get('/', [authMiddleware], getInvoices)
// router.get('/search/:query', [authMiddleware], searchProducts)
router.post('/create', [authMiddleware], create)
router.post('/delete', [authMiddleware], deleteProduct)

const saleRoutes = router
module.exports = saleRoutes