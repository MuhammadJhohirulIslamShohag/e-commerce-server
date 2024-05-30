import nodemailer from 'nodemailer';
import config from '../config';

import AWS from 'aws-sdk';

const ses = new AWS.SES({
  apiVersion: '2010-12-01',
  region: config?.aws?.aws_region,
  credentials: {
    accessKeyId: config.aws.aws_access_key_id as string,
    secretAccessKey: config.aws.aws_secret_access_key as string,
  },
});

// nodemailer data type
type SendNodemailerDataType = {
  to: string;
  subject: string;
  message: string;
};

const transporter = nodemailer.createTransport({
  SES: { ses, aws: AWS },
});

// send email with mailer
const sendEmailWithNodeMailer = async (data: SendNodemailerDataType) => {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: config.email,
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
