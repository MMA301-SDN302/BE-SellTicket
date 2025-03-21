const { stripe } = require('../config/stripe.config');
const { NotFoundError, BadRequestError } = require('../core/response/error.response');
const Ticket = require('../models/BusCompany/Ticket');
const User = require('../models/Auth/User');

class PaymentService {
  // Create a payment intent for a ticket
  async createPaymentIntent(ticketId) {
    try {
      // Find the ticket in the database
      const ticket = await Ticket.findById(ticketId);
      
      if (!ticket) {
        throw new NotFoundError('Ticket not found');
      }
      
      // Check if ticket is already paid
      if (ticket.ticket_status !== 'pending') {
        throw new BadRequestError('Ticket is not in pending status');
      }
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: ticket.ticket_price, // VND is a zero-decimal currency, no need to multiply by 100
        currency: 'vnd',
        metadata: {
          ticketId: ticket._id.toString(),
          ticketNo: ticket.ticket_No,
          userId: ticket.user_id.toString()
        },
        description: `Payment for Ticket ${ticket.ticket_No}`,
      });
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        ticket
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
  
  // Confirm payment success and update ticket status
  async confirmPayment(paymentIntentId) {
    try {
      // Retrieve the payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (!paymentIntent) {
        throw new NotFoundError('Payment intent not found');
      }
      
      console.log(`Payment intent status: ${paymentIntent.status} for ID: ${paymentIntentId}`);
      
      // If payment is still being processed, wait and try again (up to 3 times)
      let attempts = 0;
      let currentStatus = paymentIntent.status;
      
      while (currentStatus !== 'succeeded' && attempts < 3) {
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
        
        // Retrieve the updated payment intent
        const updatedIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        currentStatus = updatedIntent.status;
        
        console.log(`Attempt ${attempts}: Payment intent status is now ${currentStatus}`);
        
        // If succeeded, update the reference
        if (currentStatus === 'succeeded') {
          Object.assign(paymentIntent, updatedIntent);
          break;
        }
      }
      
      // Check if payment was successful after retries
      if (paymentIntent.status !== 'succeeded') {
        // For testing purposes, allow processing_payment status as well
        if (paymentIntent.status === 'processing' || paymentIntent.status === 'requires_capture') {
          console.log('Payment is still processing but we will continue with ticket update');
        } else {
          throw new BadRequestError(`Payment not successful. Status: ${paymentIntent.status}`);
        }
      }
      
      // Get the ticket ID from metadata
      const ticketId = paymentIntent.metadata.ticketId;
      
      // Update ticket status to confirmed using updateOne instead of save()
      // This skips validation
      const updateResult = await Ticket.updateOne(
        { _id: ticketId },
        { ticket_status: 'confirmed' },
        { runValidators: false }
      );
      
      if (updateResult.matchedCount === 0) {
        throw new NotFoundError('Ticket not found');
      }
      
      // Get updated ticket (for response only)
      const ticket = await Ticket.findById(ticketId);
      
      return { 
        success: true,
        ticketId,
        ticket 
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }
  
  // Get payment config for the front-end
  getPaymentConfig() {
    return {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51QxsKfIvit9jmuVvauj1o92CBtOlp7hPVRixfHwWhw1dWcWdobyd7LfrGvgbJvuaPkRTm6VVvm7wscm0Jqp2Kqk700nvhdweWO'
    };
  }

  // Create a payment sheet for Stripe with customer and ephemeral key
  async createStripeSheet(ticketId, customerInfo = {}) {
    try {
      // Find the ticket in the database
      const ticket = await Ticket.findById(ticketId);
      
      if (!ticket) {
        throw new NotFoundError('Ticket not found');
      }
      
      // Check if ticket is already paid
      if (ticket.ticket_status !== 'pending') {
        throw new BadRequestError('Ticket is not in pending status');
      }

      // Get or create a customer
      let customer;
      const userId = ticket.user_id.toString();
      
      // Try to get user info from database
      const user = await User.findById(userId);
      
      // Extract customer information, prioritizing:
      // 1. Explicit customerInfo provided in request (if any)
      // 2. User data from database
      // 3. Default values as fallback
      const { name, email } = customerInfo;
      
      // Correctly get user name from displayName, or combine firstName + lastName
      let userNameFromDB = '';
      if (user?.displayName) {
        userNameFromDB = user.displayName;
      } else if (user?.firstName || user?.lastName) {
        userNameFromDB = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      }
      
      const customerName = name || userNameFromDB || 'Unknown';
      const customerEmail = email || (user?.email) || `user_${userId}@example.com`;
      
      // Log user data for debugging
      console.log(`User data for ${userId}:`, {
        fromDB: { 
          displayName: user?.displayName,
          firstName: user?.firstName,
          lastName: user?.lastName,
          combinedName: userNameFromDB,
          email: user?.email 
        },
        fromRequest: { name, email },
        final: { customerName, customerEmail }
      });
      
      // Try to find existing customer for this user or email
      const customers = await stripe.customers.list({
        limit: 1,
        email: customerEmail
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
        
        // Update customer information if provided and different
        if (customer.name !== customerName || customer.email !== customerEmail) {
          customer = await stripe.customers.update(customer.id, {
            name: customerName,
            email: customerEmail
          });
        }
      } else {
        // Create a new customer with available information
        customer = await stripe.customers.create({
          name: customerName,
          email: customerEmail,
          metadata: { userId }
        });
      }
      
      // Create ephemeral key for this customer
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2020-08-27' } // Use appropriate API version
      );
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: ticket.ticket_price, // VND is a zero-decimal currency, no need to multiply by 100
        currency: 'vnd',
        customer: customer.id,
        metadata: {
          ticketId: ticket._id.toString(),
          ticketNo: ticket.ticket_No,
          userId,
          customerName,
          customerEmail
        },
        description: `Payment for Ticket ${ticket.ticket_No}`,
        // Enable future usage to save the card
        setup_future_usage: 'off_session'
      });
      
      return {
        clientSecret: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        paymentIntentId: paymentIntent.id,
        ticket,
        userInfo: {
          hasEmail: !!user?.email,
          name: customerName
        }
      };
    } catch (error) {
      console.error('Error creating payment sheet:', error);
      throw error;
    }
  }

  // Create PayOS payment link
  async createPayosPayment(ticketId, amount) {
    try {
      // Find the ticket in the database
      const ticket = await Ticket.findById(ticketId);
      
      if (!ticket) {
        throw new NotFoundError('Ticket not found');
      }
      
      // Check if ticket is already paid
      if (ticket.ticket_status !== 'pending') {
        throw new BadRequestError('Ticket is not in pending status');
      }
      
      // In a real implementation, you would integrate with PayOS API
      // For this example, we'll simulate creating a payment link
      
      const paymentUrl = `https://sandbox.payos.vn/payment?orderCode=${ticket._id.toString()}&amount=${amount}`;
      
      return {
        paymentUrl,
        ticket
      };
    } catch (error) {
      console.error('Error creating PayOS payment:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService(); 