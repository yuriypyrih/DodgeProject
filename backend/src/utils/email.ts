import nodemailer from 'nodemailer';
import { env } from './env';

export const sendEmail = async (options: {
  message: string;
  subject: string;
  email: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: env.SERVER_EMAIL,
      pass: env.SERVER_EMAIL_PASS
    }
  });

  const mailOptions = {
    from: env.SERVER_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};
