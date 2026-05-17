const nodemailer = require("nodemailer");

const sendAlertEmail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kumaramansingh2005@gmail.com",
        pass: "wdgk rpzx ceds tytq",
      },
    });

    const mailOptions = {
      from: "kumaramansingh2005@gmail.com",
      to: "nikhilranjanlkr@gmail.com",
      subject: "🚨 AI Observability Alert",
      text: `
System Alert Detected!

High CPU / Memory usage found.
Possible API failure predicted.

Please check your monitoring dashboard immediately.
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Alert email sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};

module.exports = {
  sendAlertEmail,
};