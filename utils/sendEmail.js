// const nodemailer = require("nodemailer");
// // const dotend = require("dotenv")

// require("dotenv").config();

// const sendEmail = async (options) => {
//   if (!options.email) {
//     throw new Error("No recipients defined");
//   }
//   const transport = nodemailer.createTransport({
//     host: process.env.SMPT_HOST,
//     port: process.env.SMPT_PORT,
//     auth: {
//       user: process.env.SMPT_EMAIL,
//       pass: process.env.SMPT_PASS,
//     },
//   });

//   const message = {
//     from: `${process.env.SMPT_FROM_NAME} <${process.env.SMPT_FROM_EMAIL}> `,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transport.sendMail(message);
// };
// module.exports = sendEmail;


//anshul added with new gmail SMTP
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  if (!options.email) {
    throw new Error("No recipients defined");
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMPT_HOST || "smtp.gmail.com", 
    port: process.env.SMPT_PORT || 587,
    secure: false, 
    auth: {
      user: process.env.SMPT_EMAIL,
      pass: process.env.SMPT_PASS,
    },
  });

  const message = {
    from: `${process.env.SMPT_FROM_NAME} <${process.env.SMPT_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || options.message,

  };

  transport.verify((error, success) => {
    if (error) {
      console.error(" SMTP connection error:", error);
    } else {
      console.log("✅ SMTP connection is ready to send emails!");
    }
  });

  await transport.sendMail(message);
};

module.exports = sendEmail;
