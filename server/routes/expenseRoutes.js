var express = require('express');
const { create, getExpenses, deleteExpense } = require('../app/controllers/ExpenseController');
const authMiddleware = require('../app/middlewares/authMiddleware');
var router = express.Router();


router.post('/create', [authMiddleware], create)
router.get('/get', [authMiddleware], getExpenses)
router.post('/delete', [authMiddleware], deleteExpense)

const expenseRoutes = router
module.exports = expenseRoutes