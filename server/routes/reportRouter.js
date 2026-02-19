var express = require('express');
const { getHeadingReports, getThirtyDaySaleReport, getSalesCurrentYear, getSalesDue, getPurchasesDue, getStockAlerts, profites, returns } = require('../app/controllers/ReportController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();

router.get('/heading', [authMiddleware], getHeadingReports);
router.get('/sales_thirty_days', [authMiddleware], getThirtyDaySaleReport);
router.get('/sales_this_year', [authMiddleware], getSalesCurrentYear);
router.get('/get_sales_due', [authMiddleware], getSalesDue);
router.get('/get_purchases_due', [authMiddleware], getPurchasesDue);
router.get('/get_stock_alerts', [authMiddleware], getStockAlerts);
router.get('/profites', [authMiddleware], profites)
router.get('/returns', [authMiddleware], returns)


module.exports = router