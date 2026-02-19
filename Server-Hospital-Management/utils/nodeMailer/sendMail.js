import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const APP_NAME = "HMS"

const { EMAIL_CLIENT, FRONTEND_URL, EMAIL_PASS, EMAIL_SMTP, EMAIL_PORT } = process.env;
if (!EMAIL_CLIENT || !FRONTEND_URL || !EMAIL_PASS || !EMAIL_SMTP || !EMAIL_PORT) {
  console.error("Some of variables missing for Contact worker");
  process.exit(0);
}

const transporter = nodemailer.createTransport({
  host: EMAIL_SMTP,
  port: EMAIL_PORT,
  secure: EMAIL_PORT == 465 ? true : false,
  auth: {
    user: EMAIL_CLIENT,
    pass: EMAIL_PASS,
  },
});


const sendMail = async (to, subject, text) => {

  const mailOptions = {
    from: APP_NAME,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("error in sending email: ", err);
        return;
      }
      // console.log("email sent successfuly: ", info);
      console.log("✅ Email sent successfuly");
    });
  } catch (err) {
    console.log("Error in sending email: " + err);
  }
};

export default sendMail;
// sendMail(
//   "malik29200343@gmail.com",
//   "Hello from nodemailer",
//   "This is sample email sent using nodemailer"
// );
