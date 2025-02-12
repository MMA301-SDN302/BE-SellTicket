const { ErrorCodes } = require("../core/errorConstant/httpStatusCode");
const { BadRequestError } = require("../core/response/error.response");
const logger = require("../logger");
const { isExistUser, addUser } = require("../repository/auth.repo");
const { addOtp, getOtp } = require("../repository/otp.repo");
const { isMissingObjectData, isPhoneNumber } = require("../utils");
const {
  generateToken,
  genOtpNumber,
  verifyToken,
  hashPassword,
} = require("./bcrypt.service");
const { sendOTP } = require("./sms.service");

const login = async (email, password) => {
  // logic xử lý login
};
const logout = async () => {};

const signUp = async ({
  password,
  firstName,
  lastName,
  mobilePhone,
  sex,
  traceId,
}) => {
  // logic xử lý sign up
  logger.log("AuthService", [
    "SignUp",
    { requestId: traceId },
    {
      password,
      firstName,
      lastName,
      mobilePhone,
      sex,
    },
  ]);
  const isValid = await isMissingObjectData({
    password,
    firstName,
    lastName,
    mobilePhone,
    sex,
  });
  if (isValid.length > 0) {
    throw new BadRequestError(`Missing ${isValid}`, ErrorCodes.MISSING_FIELD);
  }
  if (!isPhoneNumber(mobilePhone)) {
    throw new BadRequestError(
      `Invalid phone number`,
      ErrorCodes.INVALID_PHONE_NUMBER
    );
  }
  // check phone number exists
  if (await isExistUser(mobilePhone)) {
    throw new BadRequestError(
      "Phone number already exists",
      ErrorCodes.DUPLICATE_ENTRY
    );
  }

  // hash user and save to database
  const dataEncoded = generateToken(
    {
      password,
      firstName,
      lastName,
      mobilePhone,
      sex,
    },
    mobilePhone
  );
  const otpNumber = genOtpNumber();
  await addOtp({
    otp_number: otpNumber,
    mobile_phone: mobilePhone,
    otp_sign: dataEncoded,
  });
  // send OTP to phone number
  //await sendOTP(mobilePhone, otpNumber);
  return { phone_number: mobilePhone };
};
const verifyOtp = async ({ otpNumber, mobilePhone, traceId }) => {
  // logic xử lý verify OTP
  logger.log("AuthService", [
    "VerifyOTP",
    { requestId: traceId },
    {
      otpNumber,
      mobilePhone,
    },
  ]);
  const otpData = await getOtp(otpNumber, mobilePhone);
  if (!otpData) {
    throw new BadRequestError("Invalid OTP", ErrorCodes.INVALID_OTP);
  }
  // verify OTP
  const { otp_sign } = otpData;
  const data = verifyToken(otp_sign, mobilePhone);
  // hash password and save to database
  const passworhash = await hashPassword(data.password);
  const user = await addUser({
    password: passworhash,
    ...data,
  });
  return { phone_number: mobilePhone, userId: user._id };
};

const forgetPassword = async (email) => {};
const resetPassword = async (email, password) => {};
module.exports = {
  login,
  logout,
  signUp,
  forgetPassword,
  resetPassword,
  verifyOtp,
};
