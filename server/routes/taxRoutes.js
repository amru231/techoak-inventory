var express = require('express');
const { getTaxes, create, deleteTax } = require('../app/controllers/TaxController ');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.post('/create', [authMiddleware], create)
router.get('/get', [authMiddleware], getTaxes)
router.post('/delete', [authMiddleware], deleteTax)

const taxdRoutes = router
module.exports = taxdRoutes