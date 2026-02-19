var express = require('express');
const { getOwnerBusinesses, createOwnerBusinesses, updateOwnerBusinesses } = require('../app/controllers/BusinessController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();

router.get('/', [authMiddleware], getOwnerBusinesses);
router.post('/create', [authMiddleware], createOwnerBusinesses);
router.post('/update', [authMiddleware], updateOwnerBusinesses);


const businessRoutes = router
module.exports = businessRoutes