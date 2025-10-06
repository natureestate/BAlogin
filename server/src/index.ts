import { Hono } from "hono"
import { cors } from "hono/cors"
import { createAuth, type Env } from "./auth"
import { seedDevUser, logDevCredentials } from "./seed"
import { simpleRegister, simpleLogin, simpleGetSession } from "./simple-auth"

/**
 * สร้าง Hono app instance
 */
const app = new Hono<{ Bindings: Env }>()

/**
 * ตัวแปรสำหรับเก็บสถานะ seed
 * ป้องกันการ seed ซ้ำใน development
 */
let isSeeded = false

/**
 * Middleware สำหรับแสดง dev credentials
 * รันครั้งแรกที่มี request เข้ามา
 */
app.use("*", async (c, next) => {
  if (!isSeeded && c.env.NODE_ENV === "development") {
    isSeeded = true
    logDevCredentials(c.env)
  }
  return next()
})

/**
 * CORS Middleware
 * อนุญาตให้ frontend เข้าถึง API
 */
app.use("*", async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
  return corsMiddleware(c, next)
})

/**
 * Health check endpoint
 */
app.get("/", (c) => {
  return c.json({ 
    message: "BAlogin API",
    status: "ok",
    version: "1.0.0"
  })
})

/**
 * Simple Auth Routes (Temporary - สำหรับ development)
 * ใช้ก่อนจนกว่า Better Auth จะ config เสร็จ
 */
app.post("/api/auth/sign-up/email", async (c) => {
  try {
    const body = await c.req.json()
    const result = await simpleRegister(c.env, body.email, body.password, body.name)
    
    if (result.success && result.user) {
      const { token, ...userWithoutToken } = result.user
      // Set cookie
      c.header('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`)
      
      return c.json({
        user: userWithoutToken,
        session: {
          token,
          expiresAt: Date.now() + (60 * 60 * 24 * 7 * 1000)
        }
      })
    }
    
    return c.json({ error: result.error || 'Registration failed' }, 400)
  } catch (error) {
    console.error('Sign up error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.post("/api/auth/sign-in/email", async (c) => {
  try {
    const body = await c.req.json()
    const result = await simpleLogin(c.env, body.email, body.password)
    
    if (result.success && result.user) {
      const { token, ...userWithoutToken } = result.user
      // Set cookie
      c.header('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`)
      
      return c.json({
        user: userWithoutToken,
        session: {
          token,
          expiresAt: Date.now() + (60 * 60 * 24 * 7 * 1000)
        }
      })
    }
    
    return c.json({ error: result.error || 'Invalid credentials' }, 401)
  } catch (error) {
    console.error('Sign in error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get("/api/auth/get-session", async (c) => {
  const cookie = c.req.header('Cookie')
  const token = cookie?.match(/auth_token=([^;]+)/)?.[1]
  
  if (!token) {
    return c.json({ user: null, session: null })
  }
  
  const { user, session } = await simpleGetSession(c.env, token)
  return c.json({ user: user || null, session: session || null })
})

app.post("/api/auth/sign-out", async (c) => {
  c.header('Set-Cookie', `auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
  return c.json({ success: true })
})

/**
 * Better Auth routes (ปิดไว้ก่อน)
 * Mount auth routes ที่ /api/auth/*
 */
// app.all("/api/auth/*", async (c) => {
//   const auth = createAuth(c.env)
//   return auth.handler(c.req.raw)
// })

/**
 * Protected API endpoint example
 * ตรวจสอบ authentication ก่อนเข้าถึง
 */
app.get("/api/me", async (c) => {
  const cookie = c.req.header('Cookie')
  const token = cookie?.match(/auth_token=([^;]+)/)?.[1]
  
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  const { user, session } = await simpleGetSession(c.env, token)
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  return c.json({
    user,
    session: {
      expiresAt: session?.expiresAt,
    },
  })
})

/**
 * Update user profile endpoint
 */
app.put("/api/user/profile", async (c) => {
  const auth = createAuth(c.env)
  
  // ตรวจสอบ authentication
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  try {
    const body = await c.req.json()
    const { name, image } = body
    
    // อัปเดต user profile
    await c.env.DB.prepare(
      "UPDATE user SET name = ?, image = ?, updatedAt = ? WHERE id = ?"
    )
      .bind(name, image, Date.now(), session.user.id)
      .run()
    
    return c.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    return c.json({
      error: "Failed to update profile",
    }, 500)
  }
})

/**
 * Logout endpoint
 */
app.post("/api/auth/logout", async (c) => {
  const auth = createAuth(c.env)
  
  // ลบ session
  const response = await auth.api.signOut({
    headers: c.req.raw.headers,
  })
  
  return response
})

/**
 * Export app สำหรับ Cloudflare Workers
 */
export default app

