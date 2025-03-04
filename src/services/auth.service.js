const { ErrorCodes } = require("../core/errorConstant/httpStatusCode");
const {
  BadRequestError,
  NotFoundError,
} = require("../core/response/error.response");
const logger = require("../logger");
const {
  isExistUser,
  addUser,
  findUserByPhoneNumber,
  findUserByIdAndPhoneNumber,
  updatePassword,
} = require("../repository/auth.repo");
const { addOtp, getOtp, deleteOtp } = require("../repository/otp.repo");
const {
  createToken,
  deleteTokenByUserId,
  updateRefreshToken,
} = require("../repository/token.repo");
const { isMissingObjectData, isPhoneNumber } = require("../utils");
const {
  generateToken,
  genOtpNumber,
  verifyToken,
  hashPassword,
  comparePassword,
  generateJwtToken,
} = require("./bcrypt.service");
const { sendOTP } = require("./sms.service");
const { createDefaultConversation } = require("./message.service");
const login = async ({ phoneNumber, password, traceId }) => {
  logger.log("AuthService", [
    "Login",
    { requestId: traceId },
    {
      phoneNumber,
      password,
    },
  ]);
  // check empty field
  const isValid = await isMissingObjectData({
    phoneNumber,
    password,
  });
  if (isValid.length > 0) {
    throw new BadRequestError(`Missing ${isValid}`, ErrorCodes.MISSING_FIELD);
  }

  const user = await findUserByPhoneNumber(phoneNumber);
  if (!user) {
    throw new BadRequestError("Invalid User", ErrorCodes.INVALID_CREDENTIALS);
  }
  // check password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new BadRequestError("Invalid User", ErrorCodes.INVALID_CREDENTIALS);
  }
  await deleteTokenByUserId(user._id);
  const { accessToken, refreshToken } = await createTokenService(
    user._id,
    user.mobilePhone
  );
  return {
    user: {
      userId: user._id,
      phoneNumber: user.mobilePhone,
      displayName: `${user.firstName} ${user.lastName}`,
      gender: user.sex,
      dateOfBirth: user.dateOfBirth,
      avatar: user.avatar,
    },
    token: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  };
  // logic xử lý login
};

const createTokenService = async (userId, mobilePhone) => {
  const accessToken = generateJwtToken(
    { userId: userId, phoneNumber: mobilePhone },
    "3d"
  );

  const refreshToken = generateJwtToken(
    { userId: userId, phoneNumber: mobilePhone },
    "7d"
  );

  await createToken({
    userId: userId,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
  return { accessToken, refreshToken };
};
const logout = async () => {};

const signUp = async ({
  password,
  firstName,
  lastName,
  mobilePhone,
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
    },
  ]);
  const isValid = await isMissingObjectData({
    password,
    firstName,
    lastName,
    mobilePhone,
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
    },
    mobilePhone
  );
  const otpNumber = genOtpNumber();
  //delete old OTP if exists
  await deleteOtp(mobilePhone);
  await addOtp({
    otp_number: otpNumber,
    mobile_phone: mobilePhone,
    otp_sign: dataEncoded,
  });
  // send OTP to phone number
  await sendOTP(mobilePhone, otpNumber);
  return { mobilePhone: mobilePhone };
};
const verifyOtp = async ({ otpNumber, mobilePhone, sendType, traceId }) => {
  // logic xử lý verify OTP
  logger.log("AuthService", [
    "VerifyOTP",
    { requestId: traceId },
    {
      otpNumber,
      mobilePhone,
      sendType,
    },
  ]);
  const isValid = await isMissingObjectData({
    otpNumber,
    mobilePhone,
    sendType,
  });
  if (isValid.length > 0) {
    throw new BadRequestError(`Missing ${isValid}`, ErrorCodes.MISSING_FIELD);
  }
  const isValidPhone = await isPhoneNumber(mobilePhone);
  if (!isValidPhone) {
    throw new BadRequestError(
      `Invalid phone number`,
      ErrorCodes.INVALID_PHONE_NUMBER
    );
  }
  const otpData = await getOtp(otpNumber, mobilePhone);

  if (!otpData) {
    throw new BadRequestError("Invalid OTP", ErrorCodes.INVALID_OTP);
  }
  if (sendType === "SIGNUP") {
    return await verifySignUp(otpData, mobilePhone);
  }
  if (sendType === "FORGET_PASSWORD") {
    return await verifyForgetPassword(mobilePhone);
  }
};

const forgetPassword = async ({ mobilePhone, traceId }) => {
  logger.log("AuthService", [
    "ForgetPassword",
    { requestId: traceId },
    {
      mobilePhone,
    },
  ]);
  const isValid = await isMissingObjectData({
    mobilePhone,
  });
  if (isValid.length > 0) {
    throw new BadRequestError(`Missing ${isValid}`, ErrorCodes.MISSING_FIELD);
  }
  const isValidPhone = await isPhoneNumber(mobilePhone);
  if (!isValidPhone) {
    throw new BadRequestError(
      `Invalid phone number`,
      ErrorCodes.INVALID_PHONE_NUMBER
    );
  }
  const validUser = await findUserByPhoneNumber(mobilePhone);
  if (!validUser) {
    throw new BadRequestError(
      "User Not register",
      ErrorCodes.INVALID_CREDENTIALS
    );
  }
  const otpNumber = genOtpNumber();
  await deleteOtp(mobilePhone);
  await addOtp({
    otp_number: otpNumber,
    mobile_phone: mobilePhone,
  });
  // send OTP to phone number
  //await sendOTP(mobilePhone, otpNumber);
  return {
    mobilePhone: mobilePhone,
  };
};
const resetPassword = async ({ password, userId, mobilePhone, traceId }) => {
  logger.log("AuthService", [
    "ResetPassword",
    { requestId: traceId },
    {
      password,
      userId,
      mobilePhone,
    },
  ]);
  const isValid = await isMissingObjectData({
    password,
    userId,
    mobilePhone,
  });
  if (isValid.length > 0) {
    throw new BadRequestError(`Missing ${isValid}`, ErrorCodes.MISSING_FIELD);
  }
  const isValidPhone = await isPhoneNumber(mobilePhone);
  if (!isValidPhone) {
    throw new BadRequestError(
      `Invalid phone number`,
      ErrorCodes.INVALID_PHONE_NUMBER
    );
  }
  const user = await findUserByIdAndPhoneNumber(userId, mobilePhone);
  if (!user) {
    throw new NotFoundError("User Not Found", ErrorCodes.INVALID_CREDENTIALS);
  }
  const passwordHash = await hashPassword(password);
  await updatePassword(userId, passwordHash);
  await deleteTokenByUserId(userId);
  return {};
};

const resendOtp = async ({ mobilePhone, sendType, traceId }) => {
  logger.log("AuthService", [
    "ResendOTP",
    { requestId: traceId },
    {
      mobilePhone,
      type,
    },
  ]);
  const isValid = await isMissingObjectData({
    mobilePhone,
    type,
  });
  if (isValid.length > 0) {
    throw new BadRequestError(`Missing ${isValid}`, ErrorCodes.MISSING_FIELD);
  }
  const isValidPhone = await isPhoneNumber(mobilePhone);
  if (!isValidPhone) {
    throw new BadRequestError(
      `Invalid phone number`,
      ErrorCodes.INVALID_PHONE_NUMBER
    );
  }
  const OtpNumber = genOtpNumber();
  let sign = "";
  if (sendType === "SIGNUP") {
    const otp = await deleteOtp(mobilePhone);
    sign = otp.otp_sign;
  }
  await addOtp({
    otp_number: OtpNumber,
    mobile_phone: mobilePhone,
    otp_sign: sign,
  });
  // send OTP to phone number
  //await sendOTP(mobilePhone, OtpNumber);

  return {
    mobilePhone: mobilePhone,
  };
};

const verifySignUp = async (otpData, mobilePhone) => {
  const { otp_sign } = otpData;
  const data = verifyToken(otp_sign, mobilePhone);
  // hash password and save to database
  const password = await hashPassword(data.password);
  const user = await addUser({
    ...data,
    password: password,
  });
  //delete OTP
  await deleteOtp(mobilePhone);
  const { accessToken, refreshToken } = await createTokenService(
    user._id,
    user.mobilePhone
  );
  // create Default Conversation
  // await createDefaultConversation(user._id);

  return {
    user: {
      userId: user._id,
      phoneNumber: user.mobilePhone,
      displayName: `${user.firstName} ${user.lastName}`,
      gender: user.sex,
      dateOfBirth: user.dateOfBirth,
      avatar: user.avatar,
    },
    token: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  };
};

const verifyForgetPassword = async (mobilePhone) => {
  const user = await findUserByPhoneNumber(mobilePhone);
  if (!user) {
    throw new BadRequestError(
      "User Not register",
      ErrorCodes.INVALID_CREDENTIALS
    );
  }
  return {
    mobilePhone: mobilePhone,
    userId: user._id,
  };
};

const refreshToken = async ({ refreshToken, traceId }) => {
  logger.log("AuthService", [
    "RefreshToken",
    { requestId: traceId },
    {
      refreshToken,
    },
  ]);
  const token = await findTokenByRefreshToken(refreshToken);
  if (!token) {
    throw new BadRequestError("Invalid Token", ErrorCodes.NOT_FOUND);
  }
  if (token.refreshTokenUsed?.includes(refreshToken)) {
    throw new BadRequestError(
      "Token has been used",
      ErrorCodes.INVALID_CREDENTIALS
    );
  }
  const refreshTokenUsed = token.refreshTokenUsed.concat(refreshToken);
  const { accessToken, refreshToken: newRefreshToken } =
    await createTokenService({
      userId: token.userId,
      phoneNumber: token.phoneNumber,
    });
  await updateRefreshToken(token.userId, newRefreshToken, refreshTokenUsed);
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
module.exports = {
  login,
  logout,
  signUp,
  forgetPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
  refreshToken,
};
