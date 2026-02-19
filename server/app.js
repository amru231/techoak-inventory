const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://tech-oak.vercel.app',
    'https://tech-oak.com',
    // Add your Vercel production domain here later if needed
  ],
  credentials: true,
}));

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
app.use(logger('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
|--------------------------------------------------------------------------
| Prisma Injection
|--------------------------------------------------------------------------
*/
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
require('./routes/index')(app);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/
app.use(function (req, res, next) {
  next(createError(404));
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/
app.use(function (err, req, res, next) {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

module.exports = app;
