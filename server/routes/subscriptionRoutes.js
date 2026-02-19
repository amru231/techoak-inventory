var express = require('express');
const { activeSubscription, cancelSubscription } = require('../app/controllers/SubscriptionController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();

router.post('/active', [authMiddleware], activeSubscription);
router.post('/cancel', [authMiddleware], cancelSubscription);

const subscriptionRoutes = router
module.exports = subscriptionRoutes