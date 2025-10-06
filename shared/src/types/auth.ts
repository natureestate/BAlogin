/**
 * Login Request
 * ข้อมูลที่ต้องการสำหรับ Login
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Login Response
 * ผลลัพธ์จากการ Login
 */
export interface LoginResponse {
  success: boolean
  message?: string
  redirectUrl?: string
}

/**
 * Register Request
 * ข้อมูลที่ต้องการสำหรับ Register
 */
export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

/**
 * Register Response
 * ผลลัพธ์จากการ Register
 */
export interface RegisterResponse {
  success: boolean
  message?: string
  redirectUrl?: string
}

/**
 * OAuth Provider
 * ประเภท Social Login Provider ที่รองรับ
 */
export type OAuthProvider = 'google' | 'github'

/**
 * OAuth Callback Data
 * ข้อมูลที่ได้รับจาก OAuth Callback
 */
export interface OAuthCallbackData {
  provider: OAuthProvider
  code: string
  state: string
}

/**
 * Auth Error
 * ข้อผิดพลาดจาก Authentication
 */
export interface AuthError {
  code: string
  message: string
}

