const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const genOtpNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//jwt
const generateToken = (payload, secret) => {
  return jwt.sign(payload, secret);
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const generateJwtToken = (payload, expiresIn) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyJwtToken = async (token , callback = () => {}) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret , callback);
};

module.exports = {
  hashPassword,
  comparePassword,
  genOtpNumber,
  generateToken,
  verifyToken,
  generateJwtToken,
  verifyJwtToken,
};
