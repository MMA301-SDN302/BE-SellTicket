# Backend FastTicket (BE-SellTicket)

Backend của hệ thống FastTicket, được phát triển bằng Node.js và Express, cung cấp API cho ứng dụng di động và dashboard quản trị.

## Công Nghệ Sử Dụng

- **Node.js & Express**: Framework phát triển API
- **MongoDB & Mongoose**: Cơ sở dữ liệu và ODM
- **JWT**: Xác thực và phân quyền người dùng
- **Socket.io**: Xử lý thông báo thời gian thực
- **Stripe**: Tích hợp xử lý thanh toán
- **Nodemailer**: Gửi email thông báo và xác nhận
- **Winston**: Ghi log hệ thống
- **Express-async-handler**: Xử lý lỗi trong các route bất đồng bộ

## Cài Đặt

1. Clone repository
```bash
git clone <repository-url>
cd BE-SellTicket-develop
```

2. Cài đặt dependencies
```bash
npm install
```

3. Tạo file .env dựa trên mẫu .env.example và cấu hình các biến môi trường

4. Chạy server
```bash
# Chế độ phát triển
npm run dev

# Chế độ production
npm start
```

## Cấu Trúc Thư Mục

```
src/
├── config/            # Cấu hình hệ thống và kết nối database
├── controllers/       # Xử lý logic nghiệp vụ
├── middlewares/       # Middleware xác thực và xử lý lỗi
├── models/            # Schema và model MongoDB
├── routes/            # Định nghĩa các endpoint API
├── services/          # Service xử lý logic phức tạp
├── utils/             # Công cụ và hàm tiện ích
└── validators/        # Kiểm tra và xác thực dữ liệu đầu vào
```

## API Endpoints

### Xác Thực
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới token
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### Người Dùng
- `GET /api/users/profile` - Xem thông tin cá nhân
- `PUT /api/users/profile` - Cập nhật thông tin cá nhân
- `GET /api/users/bookings` - Xem lịch sử đặt vé

### Sự Kiện
- `GET /api/events` - Lấy danh sách sự kiện
- `GET /api/events/:id` - Xem chi tiết sự kiện
- `POST /api/events` - Tạo sự kiện mới (Admin/Organizer)
- `PUT /api/events/:id` - Cập nhật sự kiện (Admin/Organizer)
- `DELETE /api/events/:id` - Xóa sự kiện (Admin/Organizer)

### Vé
- `GET /api/tickets` - Lấy danh sách loại vé
- `GET /api/tickets/:id` - Xem chi tiết loại vé
- `POST /api/tickets/book` - Đặt vé
- `GET /api/tickets/my-tickets` - Lấy vé đã đặt
- `GET /api/tickets/validate/:code` - Xác thực mã vé

### Thanh Toán
- `POST /api/payments/create-intent` - Tạo ý định thanh toán
- `POST /api/payments/webhook` - Webhook nhận thông báo từ Stripe

## Biến Môi Trường

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fast-ticket

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
EMAIL_FROM=noreply@fastticket.com

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Socket.io
SOCKET_PORT=5001
```

## Tính Năng Chính

- **Quản lý người dùng**: Đăng ký, đăng nhập, quản lý hồ sơ người dùng
- **Quản lý sự kiện**: CRUD sự kiện, quản lý danh mục, quản lý địa điểm
- **Quản lý vé**: Tạo vé, đặt vé, hủy vé, kiểm tra trạng thái vé
- **Thanh toán**: Tích hợp Stripe để xử lý thanh toán vé
- **Xác thực và bảo mật**: Sử dụng JWT để xác thực người dùng
- **Thông báo thời gian thực**: Sử dụng Socket.io để gửi thông báo tức thời
- **Gửi email**: Thông báo, xác nhận đơn hàng, và quên mật khẩu 