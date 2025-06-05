// ***********************************
// ***** Environment Configuration *****
// ***********************************
require('dotenv').config({ path: __dirname + '/.env' });
const isProduction = process.env.NODE_ENV === 'production';

// ********************************
// ***** External Dependencies *****
// ********************************
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

// ********************************
// ***** Internal Dependencies *****
// ********************************
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const mongoErrorMiddleware = require('./middlewares/mongoError');
const rateLimiter = require('./middlewares/rateLimiter');
const logger = require('./middlewares/logger');
const connectDB = require('./config/db');
const initializePassport = require('./config/passport');
const sanitize = require('./middlewares/sanitize');

// ********************************
// ***** Database Connection *****
// ********************************
connectDB();

// ********************************
// ***** Express App Initialization *****
// ********************************
const app = express();
const httpServer = createServer(app);

// ********************************
// ***** Socket.io Initialization *****
// ********************************
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS.split(','),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

require('./config/socket')(io);

// ********************************
// ***** Security Middlewares *****
// ********************************
app.use(
  helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: isProduction,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

app.use(rateLimiter);
app.use(sanitize);
app.use(compression({ level: 6 }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// ********************************
// ***** Session Configuration *****
// ********************************
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days
    }
  })
);

// ********************************
// ***** Authentication *****
// ********************************
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// ********************************
// ***** Request Logging *****
// ********************************
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

if (!isProduction) {
  app.use(morgan('dev'));
}

// ********************************
// ***** API Routes *****
// ********************************
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));

// ********************************
// ***** Static Files *****
// ********************************
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'API is running...',
      documentation: 'http://localhost:5000/api-docs'
    });
  });
}

// ********************************
// ***** Error Handling *****
// ********************************
app.use(notFound);
app.use(errorHandler);
app.use(mongoErrorMiddleware);

// ********************************
// ***** Server Startup *****
// ********************************
const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

httpServer.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  httpServer.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down gracefully');
  httpServer.close(() => {
    logger.info('Process terminated!');
  });
});