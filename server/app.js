const next = require('next');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: '../' });
const handle = nextApp.getRequestHandler();

const prisma = new PrismaClient();

async function startServer() {
  await nextApp.prepare();   // 🔥 VERY IMPORTANT

  const app = express();

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

  // API routes first
  require('./routes/index')(app);

  // Let Next handle everything else
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log('App running on port:', port);
  });
}

startServer();
