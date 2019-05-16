import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

interface IMailer {
  send(data: IMailData);
}

interface IMailData {
  to: string;
  from: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PWD
  }
});

export { transporter, sgMail };
