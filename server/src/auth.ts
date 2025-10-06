import { betterAuth } from "better-auth"

/**
 * สร้าง Better Auth instance
 * @param env - Cloudflare Worker environment bindings
 * @returns Better Auth instance
 */
export function createAuth(env: Env) {
  // ตรวจสอบว่าเป็น development mode หรือไม่
  const isDevelopment = env.NODE_ENV === "development"
  
  // ตรวจสอบว่ามี social provider credentials หรือไม่
  const hasGoogleCredentials = !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
  const hasGitHubCredentials = !!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)
  
  // สร้าง social providers config (เฉพาะเมื่อมี credentials)
  const socialProviders: any = {}
  
  // ใน production: ต้องมี social providers
  // ใน development: ไม่บังคับ (ใช้ email/password ได้เลย)
  if (!isDevelopment || hasGoogleCredentials) {
    if (hasGoogleCredentials) {
      socialProviders.google = {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectURI: `${env.BASE_URL}/api/auth/callback/google`,
      }
    }
  }
  
  if (!isDevelopment || hasGitHubCredentials) {
    if (hasGitHubCredentials) {
      socialProviders.github = {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        redirectURI: `${env.BASE_URL}/api/auth/callback/github`,
      }
    }
  }
  
  return betterAuth({
    // Database configuration สำหรับ Cloudflare D1
    database: {
      db: env.DB,
      type: "sqlite",
    },
    
    // Base URL สำหรับ auth callbacks
    baseURL: env.BASE_URL || "http://localhost:8787",
    
    // Secret สำหรับ session encryption
    secret: env.BETTER_AUTH_SECRET,
    
    // Email/Password provider (เปิดใช้งานเสมอ)
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // เปลี่ยนเป็น true ถ้าต้องการ email verification
    },
    
    // Social providers (ปิดใน development ถ้าไม่มี credentials)
    ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
    
    // Session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 วัน
      updateAge: 60 * 60 * 24, // อัปเดตทุก 24 ชั่วโมง
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 นาที
      },
    },
    
    // Advanced options
    advanced: {
      cookiePrefix: "balogin",
      crossSubDomainCookies: {
        enabled: false,
      },
      generateId: () => {
        // สร้าง unique ID
        return crypto.randomUUID()
      },
    },
    
    // Trusted origins (สำหรับ CORS)
    trustedOrigins: [
      env.FRONTEND_URL || "http://localhost:5173",
    ],
  })
}

/**
 * Type definition สำหรับ Cloudflare Worker Environment
 */
export interface Env {
  // Required
  DB: D1Database
  BETTER_AUTH_SECRET: string
  FRONTEND_URL: string
  BASE_URL: string
  NODE_ENV: string
  
  // Development User Credentials (สำหรับ auto-seed)
  DEV_USER_EMAIL?: string
  DEV_USER_PASSWORD?: string
  DEV_USER_NAME?: string
  
  // Social Providers (Optional ใน development, Required ใน production)
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
}

