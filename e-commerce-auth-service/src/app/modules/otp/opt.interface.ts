import { Model } from 'mongoose'

export type IOtp = {
  otp: number
  expireDate: Date
  email: string
  phone:string
  method: 'email' | 'phone'
}

export type OtpModel = Model<IOtp>
