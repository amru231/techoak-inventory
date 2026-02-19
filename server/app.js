var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

var app = express();

// view engine setup


app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://tech-oak.vercel.app',
    'https://tech-oak.com',
  ],
  credentials: true,
}))

app.use(logger('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({
  extended: true,
  // limit: '5mb'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const prisma = new PrismaClient()

app.use(function (req, res, next) {
  req.prisma = prisma
  next()
})

// Routes
require('./routes/index')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
