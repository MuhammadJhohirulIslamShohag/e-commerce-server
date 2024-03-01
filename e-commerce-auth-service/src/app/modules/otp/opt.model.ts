import { Schema, model } from 'mongoose'
import { otpMethodEnum } from './otp.constant'
import { IOtp, OtpModel } from './opt.interface'

const otpSchema = new Schema<IOtp, OtpModel>({
  otp: {
    type: Number,
  },
  expireDate: {
    type: Date,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  method: {
    type: String,
    enum: otpMethodEnum,
  },
})

const Otp = model<IOtp, OtpModel>('Otp', otpSchema)

export default Otp
