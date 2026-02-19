var express = require('express');
const { create, deletePos, getProducts, getInvoices } = require('../app/controllers/PosController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.get('/', [authMiddleware], getInvoices)
router.post('/create', [authMiddleware], create)
router.get('/products', [authMiddleware], getProducts)
router.post('/delete', [authMiddleware], deletePos)

const posRoutes = router
module.exports = posRoutes