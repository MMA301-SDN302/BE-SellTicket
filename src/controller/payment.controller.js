const paymentService = require('../services/payment.service');
const { OK, CREATED } = require('../core/response/success.response');
const { BadRequestError } = require('../core/response/error.response');
const EmailService = require("../services/email.service");
const TicketService = require("../services/ticket.service");
const { stripe } = require('../config/stripe.config');

// Create a payment intent for Stripe
const createPaymentIntent = async (req, res, next) => {
  try {
    const { ticketId } = req.body;
    
    if (!ticketId) {
      throw new BadRequestError('Ticket ID is required');
    }
    
    const paymentData = await paymentService.createPaymentIntent(ticketId);
    
    return new OK({
      message: 'Payment intent created successfully',
      metadata: paymentData
    }).send(req, res);
  } catch (error) {
    next(error);
  }
};

// Confirm a payment was successful
const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    
    console.log("Received paymentIntentId:", paymentIntentId);
    console.log("Request body:", JSON.stringify(req.body));
    
    if (!paymentIntentId || paymentIntentId.trim() === '') {
      throw new BadRequestError('Payment intent ID is required');
    }
    
    const result = await paymentService.confirmPayment(paymentIntentId);
    
    // If payment is successful, send confirmation email
    if (result.success) {
      const ticket = await TicketService.getTicketById(result.ticketId);
      if (ticket) {
        // Get user email from the payment intent metadata
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const customerEmail = paymentIntent.metadata.customerEmail;
        
        await EmailService.sendTicketConfirmation({
          ticketNo: ticket.ticket_No,
          customerName: ticket.passenger,
          customerEmail: customerEmail,
          departure: ticket.startlocation,
          destination: ticket.endlocation,
          departureTime: ticket.trip_id?.tripStartTime || new Date(),
          seatNo: ticket.ticket_seat,
          price: ticket.ticket_price,
          busType: ticket.busType || 'Standard'
        });
      }
    }

    return new OK({
      message: 'Payment confirmed successfully',
      metadata: result
    }).send(req, res);
  } catch (error) {
    console.error("Error confirming payment:", error);
    next(error);
  }
};

// Get Stripe configuration for the frontend
const getPaymentConfig = async (req, res, next) => {
  try {
    const config = paymentService.getPaymentConfig();
    
    return new OK({
      message: 'Payment configuration retrieved successfully',
      metadata: config
    }).send(req, res);
  } catch (error) {
    next(error);
  }
};

// Create a payment sheet setup for Stripe
const createStripeSheet = async (req, res, next) => {
  try {
    const { ticketId, customerName, customerEmail } = req.body;
    
    if (!ticketId) {
      throw new BadRequestError('Ticket ID is required');
    }
    
    // Prepare customer information if provided
    const customerInfo = {};
    if (customerName) customerInfo.name = customerName;
    if (customerEmail) customerInfo.email = customerEmail;
    
    const paymentData = await paymentService.createStripeSheet(ticketId, customerInfo);
    
    return new OK({
      message: 'Payment sheet created successfully',
      metadata: paymentData
    }).send(req, res);
  } catch (error) {
    next(error);
  }
};

// Create a PayOS payment link
const createPayosPayment = async (req, res, next) => {
  try {
    const { ticketId, amount } = req.body;
    
    if (!ticketId || !amount) {
      throw new BadRequestError('Ticket ID and amount are required');
    }
    
    const paymentData = await paymentService.createPayosPayment(ticketId, amount);
    
    return new OK({
      message: 'PayOS payment link created successfully',
      metadata: paymentData
    }).send(req, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentConfig,
  createStripeSheet,
  createPayosPayment
}; 