const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (email, password) => {
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
    subject: 'Welcome to FlexCap!',
    text: `Dear User,

Welcome to FlexCap! Your account has been successfully created.

Here are your login credentials:
Email: ${email}
Password: ${password}

Please log in and change your password as soon as possible for security purposes.

Best regards,
The FlexCap Team`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendWelcomeEmail;
