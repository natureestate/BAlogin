import { createAuthClient } from "better-auth/react"
import { cloudflareClient } from "better-auth-cloudflare/client"

/**
 * Better Auth Client Instance
 * สร้าง client สำหรับเชื่อมต่อกับ Better Auth API
 * รวม Cloudflare integration (geolocation, file uploads)
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  plugins: [
    cloudflareClient(), // เพิ่ม Cloudflare features
  ],
})

/**
 * Export hooks สำหรับใช้งาน authentication
 */
export const { useSession, signIn, signUp, signOut } = authClient

