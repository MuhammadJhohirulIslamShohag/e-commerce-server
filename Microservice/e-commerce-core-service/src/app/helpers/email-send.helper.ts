import nodemailer from 'nodemailer';
import config from '../config';

// nodemailer data type
type SendNodemailerDataType = {
  to: string;
  subject: string;
  message: string;
};

// create nodemailer transporter with AWS SES SMTP service configuration
const transporter = nodemailer.createTransport({
  host: config?.aws?.aws_email_host,
  port: 465,
  secure: true,
  auth: {
    user: config?.aws?.aws_email_user,
    pass: config?.aws?.aws_email_pass,
  },
});

// send email with mailer
const sendEmailWithNodeMailer = async (data: SendNodemailerDataType) => {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '<noreply@introbangla.com>',
      to: data?.to,
      subject: data?.subject,
      text: data?.message,
      html: `${data.message}`,
    });

    return info.messageId;
  } catch (err) {
    return 'failed';
  }
};

export const EmailSenderHelpers = {
  sendEmailWithNodeMailer,
};
