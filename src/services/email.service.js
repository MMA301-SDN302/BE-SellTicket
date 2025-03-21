const nodemailer = require('nodemailer');
const { BadRequestError } = require('../core/response/error.response');
const { formatPrice } = require('../utils/format.utils');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendTicketConfirmation(ticketData) {
    try {
      const {
        ticketNo,
        customerName,
        customerEmail,
        departure,
        destination,
        departureTime,
        seatNo,
        price,
        busType
      } = ticketData;

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #2a3266; text-align: center;">Xác Nhận Đặt Vé</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2a3266; margin-bottom: 15px;">Thông Tin Vé</h3>
            <p><strong>Mã vé:</strong> ${ticketNo}</p>
            <p><strong>Khách hàng:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Điểm đi:</strong> ${departure}</p>
            <p><strong>Điểm đến:</strong> ${destination}</p>
            <p><strong>Thời gian khởi hành:</strong> ${new Date(departureTime).toLocaleString('vi-VN')}</p>
            <p><strong>Số ghế:</strong> ${seatNo}</p>
            <p><strong>Loại xe:</strong> ${busType}</p>
            <p><strong>Giá vé:</strong> ${formatPrice(price)} VND</p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
            <p>Cảm ơn bạn đã sử dụng dịch vụ của FastTicket!</p>
            <p>Vui lòng giữ email này làm bằng chứng thanh toán.</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: `[FastTicket] Xác nhận đặt vé #${ticketNo}`,
        html: emailContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      throw new BadRequestError('Không thể gửi email xác nhận: ' + error.message);
    }
  }
}

module.exports = new EmailService(); 