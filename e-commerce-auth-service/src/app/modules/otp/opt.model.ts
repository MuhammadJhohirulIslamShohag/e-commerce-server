import { Schema, model } from 'mongoose';
import validator from 'validator';

import { IOtp, OtpModel } from './opt.interface';

const otpSchema = new Schema<IOtp, OtpModel>({
  email: {
    type: String,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Provide a Valid Email!'],
  },
  otp: {
    type: Number,
    required: [true, 'Provide a OTP!'],
  },
  expireDate: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  },
});

const Otp = model<IOtp, OtpModel>('Otp', otpSchema);

export default Otp;
