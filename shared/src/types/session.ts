import type { User } from './user'

/**
 * Session Type Definition
 * ประเภทข้อมูลสำหรับ Session ของผู้ใช้
 */
export interface Session {
  id: string
  userId: string
  expiresAt: Date
  token: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

/**
 * Session With User
 * Session พร้อมข้อมูลผู้ใช้
 */
export interface SessionWithUser extends Session {
  user: User
}

/**
 * Active Session
 * ข้อมูล Session ที่กำลังใช้งาน (ส่งกลับไปที่ client)
 */
export interface ActiveSession {
  user: User
  expiresAt: Date
}

