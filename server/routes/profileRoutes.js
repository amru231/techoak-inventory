var express = require('express');
const { update, password } = require('../app/controllers/ProfileController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.post('/update', [authMiddleware], update)
router.post('/password', [authMiddleware], password)


const profileRoutes = router
module.exports = profileRoutes