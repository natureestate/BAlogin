/**
 * User Type Definition
 * ประเภทข้อมูลสำหรับผู้ใช้ในระบบ
 */
export interface User {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * User Create Input
 * ข้อมูลที่ต้องการสำหรับสร้างผู้ใช้ใหม่
 */
export interface UserCreateInput {
  email: string
  password: string
  name?: string
}

/**
 * User Update Input
 * ข้อมูลที่สามารถอัปเดตได้สำหรับผู้ใช้
 */
export interface UserUpdateInput {
  name?: string
  image?: string
}

/**
 * User Profile
 * ข้อมูล Profile ของผู้ใช้ (ไม่รวมข้อมูลละเอียดอ่อน)
 */
export type UserProfile = Omit<User, 'emailVerified'>

