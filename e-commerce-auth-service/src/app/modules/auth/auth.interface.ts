export type ICreateLoggedUserResponse<T> = {
  accessToken: string
  refreshToken?: string
  result?: T | null
}
export type ICreateUserInfo<T> = {
  accessToken: string
  refreshToken: string
  userInfo: T | null
}
export type ICreateUserAndOptResponse = {
  message: string
}
