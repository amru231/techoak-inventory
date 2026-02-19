var express = require('express');
const { deleteVariation } = require('../app/controllers/VariationController');
const { getVariations } = require('../app/controllers/VariationController');
const { create } = require('../app/controllers/VariationController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.post('/create', [authMiddleware], create)
router.get('/get', [authMiddleware], getVariations)
router.post('/delete', [authMiddleware], deleteVariation)

const variationRoutes = router
module.exports = variationRoutes