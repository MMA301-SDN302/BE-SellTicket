const ERROR_CODES = {
  // Lỗi liên quan đến dữ liệu đầu vào
  MISSING_FIELD: "MISSING_FIELD", // Thiếu trường bắt buộc
  INVALID_FORMAT: "INVALID_FORMAT", // Dữ liệu không đúng định dạng
  INVALID_LENGTH: "INVALID_LENGTH", // Dữ liệu không đúng độ dài
  INVALID_TYPE: "INVALID_TYPE", // Kiểu dữ liệu không hợp lệ
  INVALID_PHONE_NUMBER: "INVALID_PHONE_NUMBER", // Số điện thoại không hợp lệ
  // Lỗi liên quan đến xác thực
  INVALID_OTP: "INVALID_OTP", // OTP không đúng
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS", // Thông tin đăng nhập không hợp lệ
  UNAUTHORIZED: "UNAUTHORIZED", // Không có quyền truy cập
  FORBIDDEN: "FORBIDDEN", // Bị cấm truy cập
  JWT_EXPIRED: "JWT_EXPIRED", // JWT hết hạn

  // Lỗi liên quan đến dữ liệu trùng lặp
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY", // Dữ liệu đã tồn tại

  // Lỗi hệ thống
  INTERNAL_ERROR: "INTERNAL_ERROR", // Lỗi hệ thống
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE", // Dịch vụ không khả dụng

  // Lỗi không xác định
  UNKNOWN_ERROR: "UNKNOWN_ERROR", // Lỗi không xác định
};

module.exports = ERROR_CODES;
