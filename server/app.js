const express = require('express');
const next = require('next');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: '../' });
const handle = nextApp.getRequestHandler();

const prisma = new PrismaClient();
const app = express();

nextApp.prepare().then(() => {

  // ===== MIDDLEWARE =====

  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://tech-oak.vercel.app',
      'https://tech-oak.com',
    ],
    credentials: true,
  }));

  app.use(logger('dev'));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use((req, res, nextMiddleware) => {
    req.prisma = prisma;
    nextMiddleware();
  });

  // ===== API ROUTES =====
  require('./routes/index')(app);

  // ===== NEXT HANDLER =====
  app.all('*', (req, res) => {
    return handle(req, res);
  });

});

module.exports = app;
