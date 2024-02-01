/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'

// admin role enum
type RoleType = 'superAdmin' | 'admin'
// admin status enum
type StatusType = 'active' | 'inActive' | 'terminated'

export type IAdmin = {
  _id?: string
  name: string
  email: string
  password: string
  address: {
    country: string
    town: string
    city: string
    hometown: string
  }
  about: string
  phone: string
  designation: string
  workAs: string
  education: string
  language: string
  emailVerified: boolean
  profileImage: string
  role: RoleType
  status: StatusType
}

// admin model type
export type AdminModel = {
  isExitAdmin({
    id,
    email,
  }: {
    id?: string
    email?: string
  }): Promise<Pick<IAdmin, 'email' | 'name' | 'role' | 'status' | '_id'>>
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IAdmin>

// admin filterable filed
export type AdminFilters = {
  searchTerm?: string
}

// create admin return type
export type CreateReturnResponse = {
  accessToken: string
  refreshToken?: string
  userInfo?: IAdmin
}
