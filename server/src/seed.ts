import { createAuth, type Env } from "./auth"

/**
 * Auto-seed Development User
 * สร้าง development user อัตโนมัติเมื่อ server เริ่มทำงานใน development mode
 * 
 * @param env - Cloudflare Worker environment bindings
 */
export async function seedDevUser(env: Env): Promise<void> {
  // เช็คว่าเป็น development environment หรือไม่
  if (env.NODE_ENV !== "development") {
    console.log("⏭️  Skipping dev user seed (not in development mode)")
    return
  }

  // ตรวจสอบว่ามี dev user credentials หรือไม่
  if (!env.DEV_USER_EMAIL || !env.DEV_USER_PASSWORD) {
    console.warn("⚠️  DEV_USER_EMAIL และ DEV_USER_PASSWORD ไม่ได้ถูกตั้งค่าใน environment variables")
    return
  }

  try {
    // ตรวจสอบว่ามี user อยู่แล้วหรือไม่
    const existingUser = await env.DB.prepare(
      "SELECT id FROM user WHERE email = ?"
    )
      .bind(env.DEV_USER_EMAIL)
      .first()

    if (existingUser) {
      console.log(`✅ Dev user already exists: ${env.DEV_USER_EMAIL}`)
      return
    }

    // สร้าง Better Auth instance
    const auth = createAuth(env)

    // สร้าง dev user ผ่าน Better Auth API
    // Better Auth จะจัดการ password hashing ให้เอง
    const timestamp = Date.now()
    const userId = crypto.randomUUID()

    // เนื่องจาก Better Auth ต้องการ Request object สำหรับ signUp
    // เราจะสร้าง user โดยตรงในฐานข้อมูลแทน
    // และให้ Better Auth จัดการ password hashing

    // สร้าง mock request สำหรับ Better Auth
    const mockRequest = new Request(`${env.BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: env.DEV_USER_EMAIL,
        password: env.DEV_USER_PASSWORD,
        name: env.DEV_USER_NAME || "Dev User",
      }),
    })

    // เรียก Better Auth sign-up endpoint
    const response = await auth.handler(mockRequest)
    
    if (response.ok) {
      console.log(`\n🎉 Dev user created successfully!`)
      console.log(`📧 Email: ${env.DEV_USER_EMAIL}`)
      console.log(`🔑 Password: ${env.DEV_USER_PASSWORD}`)
      console.log(`👤 Name: ${env.DEV_USER_NAME || "Dev User"}\n`)
    } else {
      const errorText = await response.text()
      console.error(`❌ Failed to create dev user: ${errorText}`)
    }

  } catch (error) {
    // ถ้า user มีอยู่แล้วหรือเกิด error อื่นๆ ให้ skip
    if (error instanceof Error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        console.log(`✅ Dev user already exists: ${env.DEV_USER_EMAIL}`)
      } else {
        console.error("❌ Error seeding dev user:", error.message)
      }
    }
  }
}

/**
 * แสดงข้อมูล development credentials
 * 
 * @param env - Cloudflare Worker environment bindings
 */
export function logDevCredentials(env: Env): void {
  if (env.NODE_ENV === "development" && env.DEV_USER_EMAIL) {
    console.log("\n" + "=".repeat(60))
    console.log("🔧 DEVELOPMENT MODE")
    console.log("=".repeat(60))
    console.log(`📧 Dev Email: ${env.DEV_USER_EMAIL}`)
    console.log(`🔑 Dev Password: ${env.DEV_USER_PASSWORD}`)
    console.log(`👤 Dev Name: ${env.DEV_USER_NAME || "Dev User"}`)
    console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`)
    console.log(`🔗 API URL: ${env.BASE_URL}`)
    console.log("=".repeat(60) + "\n")
  }
}

