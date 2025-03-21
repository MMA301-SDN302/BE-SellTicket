const express = require('express');
const controller = require('../controller/payment.controller');
const asyncHandler = require('express-async-handler');

const router = express.Router();

// Payment routes
router.post('/create-intent', asyncHandler(controller.createPaymentIntent));
router.post('/confirm', asyncHandler(controller.confirmPayment));
router.get('/config', asyncHandler(controller.getPaymentConfig));

// New routes for payment sheet and PayOS
router.post('/stripe-sheet', asyncHandler(controller.createStripeSheet));
router.post('/payos-payment', asyncHandler(controller.createPayosPayment));

module.exports = router; 