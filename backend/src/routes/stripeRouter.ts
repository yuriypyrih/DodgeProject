import express from 'express';
import * as authController from '../controllers/authController';
import * as paymentController from '../controllers/paymentController';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
router.post('/payment', paymentController.createPaymentIntent);

export default router;
