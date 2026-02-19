var express = require('express');
const { deleteUnit } = require('../app/controllers/UnitController');
const { getUnits } = require('../app/controllers/UnitController');
const { create } = require('../app/controllers/UnitController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.post('/create', [authMiddleware], create)
router.get('/get', [authMiddleware], getUnits)
router.post('/delete', [authMiddleware], deleteUnit)

const unitRoutes = router
module.exports = unitRoutes