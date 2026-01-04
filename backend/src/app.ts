import userRouter from './routes/userRouter';
import gameRouter from './routes/gameRouter';
import stripeRouter from './routes/stripeRouter';
import * as paymentController from './controllers/paymentController';

import { AppError } from './utils/appError';
import path from 'path';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { globalErrorHandler } from './controllers/errorController';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import connectDB from './database';

import { env } from './utils/env';
import { setupSwagger } from './swagger';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log('Error:', err);
  process.exit(1);
});

const app = express();

/// Global Middleware

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Development logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from the this IP, please try again in an hour!'
});
// app.use('/api', limiter);

import bodyParser from 'body-parser';

// Stripe webhook — MUST be first
app.post(
  '/api/v1/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }),
  paymentController.webhookParser
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
// Test middleware
app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/game', gameRouter);
app.use('/api/v1/stripe', stripeRouter);

// Setup Swagger
setupSwagger(app);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export const startServer = async () => {
  try {
    // Database connection
    await connectDB();

    // Middleware for handling 404 Not Found
    // app.use((_req, res) => {
    //   res.status(404).send({ message: 'Endpoint NOT FOUND' });
    // });

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};
