var express = require('express');
const { create, getBrands, deleteBrand } = require('../app/controllers/BrandController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.post('/create', [authMiddleware], create)
router.get('/get', [authMiddleware], getBrands)
router.post('/delete', [authMiddleware], deleteBrand)

const brandRoutes = router
module.exports = brandRoutes