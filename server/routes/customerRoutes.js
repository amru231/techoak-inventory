var express = require('express');
const { getCustomers, createCustomer, deleteCustomer } = require('../app/controllers/CustomerController ')
const authMiddleware = require('../app/middlewares/authMiddleware');

var router = express.Router();

router.get('/', [authMiddleware], getCustomers)
router.post('/create', [authMiddleware], createCustomer)
router.post('/delete', [authMiddleware], deleteCustomer)

const customerRoutes = router
module.exports = customerRoutes