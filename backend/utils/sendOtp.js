const nodemailer = require('nodemailer');

const sendOtp = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'flexcap.fix@gmail.com',
      pass: 'lnqd gtfk hfkq gqcx', // Replace with your App Password
    },
  });

  let mailOptions = {
    from: 'flexcap.fix@gmail.com',
    to: email,
    subject: 'FlexCap: Your One-Time Password (OTP) Code',
    text: `Dear User,

Thank you for using FlexCap. Please use the following One-Time Password (OTP) to proceed with your request:

OTP: ${otp}

This code is valid for 5 minutes. If you did not request this code, please ignore this email.

Best regards,
The FlexCap Team`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtp;
