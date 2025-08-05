import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // Check for missing credentials
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Email service credentials are missing in .env file");
    }

    // Create reusable transporter object
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP
      port: 465, // Secure port
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"Secure Auth App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    throw new Error("Unable to send email. Please try again later.");
  }
};

export default sendEmail;
