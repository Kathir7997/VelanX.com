const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (process.env.EMAIL_USER === 'your_email@gmail.com') {
      console.log(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      console.log(`📧 [MOCK EMAIL] Content: ${html}`);
      return;
    }

    await transporter.sendMail({
      from: `"VelanX" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    // Don't throw error to prevent app crash when email fails
  }
};

module.exports = { sendEmail };
