var express = require('express');
const { getSuppliers, createSupplier, deleteSupplier } = require('../app/controllers/SupplierController');
const authMiddleware = require('../app/middlewares/authMiddleware');

var router = express.Router();

router.get('/', [authMiddleware], getSuppliers)
router.post('/create', [authMiddleware], createSupplier)
router.post('/delete', [authMiddleware], deleteSupplier)


const supplierRoutes = router
module.exports = supplierRoutes