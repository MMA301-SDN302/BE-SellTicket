const axios = require("axios");
const { BadRequestError } = require("../core/response/error.response");

const sendSMS = async (phones, content) => {
  const url = process.env.SMS_URL;
  const accessToken = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER_ID;
  const params = JSON.stringify({
    to: phones,
    content: content,
    sms_type: 2,
    sender: sender,
  });

  const buf = new Buffer(accessToken + ":x");
  const auth = "Basic " + buf.toString("base64");

  return await axios
    .post(`https://${url}/index.php/sms/send`, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    })
    .then((res) => {
      if (res.data.code === "00") {
        return res.data;
      } else if (res.data.code === "105") {
        throw new BadRequestError("Invalid phone number");
      } else {
        throw new BadRequestError("Send SMS failed");
      }
    });
};

const sendOTP = async (phones, otp) => {
  const hash = process.env.SMS_HASH;
  const content = `Ma xac thuc FastTicket cua ban la: ${otp} . Vui long khong chia se ma nay voi bat ky ai. Cam on ban da su dung dich vu cua chung toi !!! ${hash}`;
  return await sendSMS([phones], content);
};

module.exports = {
  sendSMS,
  sendOTP,
};
