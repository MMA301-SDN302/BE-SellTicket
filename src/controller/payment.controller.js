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
          departureTime: new Date(),
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

// Thêm phương thức mới
const getStripeBalance = async (req, res, next) => {
  try {
    const balance = await stripe.balance.retrieve();
    
    console.log('Stripe raw balance data:', JSON.stringify(balance, null, 2));
    
    // Xử lý dữ liệu từ Stripe
    const available = balance.available.reduce((sum, item) => sum + item.amount, 0);
    const pending = balance.pending.reduce((sum, item) => sum + item.amount, 0);
    
    console.log('Processed balance amounts:', { available, pending });
    
    // Trả về giá trị USD nguyên bản để xử lý ở frontend
    const availableUSD = (available / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const pendingUSD = (pending / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    console.log('Formatted USD values:', { availableUSD, pendingUSD });
    
    // Tính tỷ lệ phần trăm
    const totalAmount = available + pending;
    const progressPercent = totalAmount > 0 ? Math.round((available / totalAmount) * 100) : 0;
    
    return res.status(200).json({
      success: true,
      data: {
        available: availableUSD,
        pending: pendingUSD,
        progress: `${progressPercent}%`
      }
    });
  } catch (error) {
    console.error("Error retrieving Stripe balance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve Stripe balance",
      error: error.message
    });
  }
};

// Lấy danh sách giao dịch thanh toán từ Stripe
const getPaymentList = async (req, res, next) => {
  try {
    const { limit = 10, starting_after, ending_before } = req.query;
    
    // Tạo options cho API call
    const options = {
      limit: parseInt(limit),
      expand: ['data.customer', 'data.payment_intent']
    };
    
    // Thêm phân trang nếu có
    if (starting_after) {
      options.starting_after = starting_after;
    }
    if (ending_before) {
      options.ending_before = ending_before;
    }
    
    // Lấy danh sách giao dịch từ Stripe
    const charges = await stripe.charges.list(options);
    
    // Format dữ liệu để hiển thị
    const formattedCharges = charges.data.map(charge => {
      return {
        id: charge.id,
        amount: charge.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        status: charge.status,
        created: new Date(charge.created * 1000).toLocaleString('vi-VN'),
        paymentMethod: charge.payment_method_details?.type || 'unknown',
        description: charge.description,
        customer: charge.customer?.name || charge.billing_details?.name || 'Guest',
        email: charge.customer?.email || charge.billing_details?.email || '',
        receipt_url: charge.receipt_url
      };
    });
    
    return res.status(200).json({
      success: true,
      data: {
        charges: formattedCharges,
        has_more: charges.has_more,
        next_page: charges.has_more ? charges.data[charges.data.length - 1].id : null
      }
    });
  } catch (error) {
    console.error("Error fetching payment list:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment list",
      error: error.message
    });
  }
};

// Lấy thống kê doanh thu theo ngày
const getPaymentStats = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const limit = parseInt(days);
    
    // Tạo mảng các ngày để lấy dữ liệu
    const dates = [];
    
    // Tạo ngày hiện tại theo múi giờ Việt Nam (UTC+7)
    const today = new Date();
    // Điều chỉnh múi giờ UTC+7 cho Việt Nam
    const vietnamTime = new Date(today.getTime() + (7 * 60 * 60 * 1000)); // Thêm 7 giờ để điều chỉnh
    
    // Tạo mảng ngày từ hôm nay đến 'days' ngày trước theo múi giờ Việt Nam
    for (let i = limit - 1; i >= 0; i--) {
      const date = new Date(vietnamTime);
      date.setDate(vietnamTime.getDate() - i);
      
      // Đặt thời gian về đầu ngày theo múi giờ Việt Nam
      date.setHours(0, 0, 0, 0);
      
      dates.push({
        date: date,
        timestamp: Math.floor(date.getTime() / 1000), // Timestamp theo giây cho Stripe
        formattedDate: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        amount: 0
      });
    }
    
    // Tính startDate là 'days' ngày trước bắt đầu từ 0h múi giờ Việt Nam
    const startDate = dates[0].timestamp;
    const endDate = Math.floor(new Date(vietnamTime).setHours(23, 59, 59, 999) / 1000); // Kết thúc ngày hôm nay
    
    // Lấy dữ liệu thanh toán từ Stripe
    const charges = await stripe.charges.list({
      limit: 100, // Giới hạn số lượng giao dịch tối đa
      created: { 
        gte: startDate,
        lte: endDate
      } // Chỉ lấy giao dịch từ startDate đến cuối ngày hiện tại
    });
    
    // Tính toán doanh thu theo ngày
    charges.data.forEach(charge => {
      // Bỏ qua các giao dịch không thành công
      if (charge.status !== 'succeeded') return;
      
      // Chuyển đổi thời gian Stripe (UTC) sang múi giờ Việt Nam
      const chargeTimestamp = charge.created * 1000; // Milliseconds
      const chargeVNTime = new Date(chargeTimestamp + (7 * 60 * 60 * 1000)); // Thêm 7 giờ
      
      // Đặt về đầu ngày để so sánh
      chargeVNTime.setHours(0, 0, 0, 0);
      const chargeVNTimestamp = Math.floor(chargeVNTime.getTime() / 1000);
      
      // Tìm ngày tương ứng trong mảng dates
      const dateEntry = dates.find(d => 
        // So sánh ngày theo timestamp đầu ngày
        d.timestamp === chargeVNTimestamp
      );
      
      if (dateEntry) {
        // VND là zero-decimal currency, không cần chia cho 100
        dateEntry.amount += charge.amount;
      }
    });
    
    // Format dữ liệu để trả về
    const result = {
      labels: dates.map(d => d.formattedDate),
      data: dates.map(d => d.amount)
    };
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment statistics",
      error: error.message
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentConfig,
  createStripeSheet,
  createPayosPayment,
  getStripeBalance,
  getPaymentList,
  getPaymentStats
}; 