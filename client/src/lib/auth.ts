import { createAuthClient } from "better-auth/react"

/**
 * Better Auth Client Instance
 * สร้าง client สำหรับเชื่อมต่อกับ Better Auth API
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
})

/**
 * Export hooks สำหรับใช้งาน authentication
 */
export const { useSession, signIn, signUp, signOut } = authClient

