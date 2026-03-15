import type { User } from '@/features/users'

// サインアップ
export type SignUpParams = {
  name: string
  email: string
  prefectureCode: string
  password: string
  passwordConfirmation: string
}

// サインイン
export type SignInParams = {
  email: string
  password: string
}

// UserAuthHeaders
export type AuthHeaders = {
  uid: string
  client: string
  accessToken: string
}

// apiからのレスポンスは{ data { data : User } }という階層になっている
export type UserResponse = {
  data: User
}

// パスワード再生設定
export type SendResetMailParams = {
  email: string
  redirect_url: string
}

// パスワード再設定フォームの型
export type PasswordResetParams = {
  password: string
  passwordConfirmation: string
}

export type PasswordResetHeaders = {
  uid: string
  client: string
  accessToken: string
  resetPasswordToken: string
}
