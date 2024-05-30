import { Model } from 'mongoose'

export type IOtp = {
  otp: number
  expireDate: Date
  email: string
}

export type ICreateOtp = {
  email: string
}
export type IOtpUserVerify = {
  email: string
  role: string
}

export type OtpModel = Model<IOtp>
