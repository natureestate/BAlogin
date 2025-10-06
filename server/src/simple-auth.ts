import type { Env } from "./auth"

/**
 * Simple Auth Helper Functions
 * ใช้ temporary สำหรับ development ก่อนที่ Better Auth จะพร้อม
 */

/**
 * Hash password ด้วย Web Crypto API
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * สร้าง user ใหม่
 */
export async function simpleRegister(
  env: Env,
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // ตรวจสอบว่ามี user อยู่แล้วหรือไม่
    const existing = await env.DB.prepare(
      "SELECT id FROM user WHERE email = ?"
    ).bind(email).first()

    if (existing) {
      return { success: false, error: "Email already exists" }
    }

    const userId = crypto.randomUUID()
    const passwordId = crypto.randomUUID()
    const passwordHash = await hashPassword(password)
    const timestamp = Date.now()

    // สร้าง user
    await env.DB.prepare(
      "INSERT INTO user (id, email, emailVerified, name, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(userId, email, 0, name || '', null, timestamp, timestamp).run()

    // เก็บ password
    await env.DB.prepare(
      "INSERT INTO password (id, userId, hash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)"
    ).bind(passwordId, userId, passwordHash, timestamp, timestamp).run()

    // สร้าง session
    const sessionId = crypto.randomUUID()
    const token = crypto.randomUUID()
    const expiresAt = timestamp + (60 * 60 * 24 * 7 * 1000) // 7 days

    await env.DB.prepare(
      "INSERT INTO session (id, userId, expiresAt, token, ipAddress, userAgent, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(sessionId, userId, expiresAt, token, null, null, timestamp).run()

    return {
      success: true,
      user: {
        id: userId,
        email,
        name: name || '',
        emailVerified: false,
        image: null,
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
        token
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Registration failed' }
  }
}

/**
 * Login user
 */
export async function simpleLogin(
  env: Env,
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // หา user
    const user = await env.DB.prepare(
      "SELECT * FROM user WHERE email = ?"
    ).bind(email).first() as any

    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    // ตรวจสอบ password
    const passwordRecord = await env.DB.prepare(
      "SELECT hash FROM password WHERE userId = ?"
    ).bind(user.id).first() as any

    if (!passwordRecord) {
      return { success: false, error: "Invalid credentials" }
    }

    const passwordHash = await hashPassword(password)
    if (passwordHash !== passwordRecord.hash) {
      return { success: false, error: "Invalid credentials" }
    }

    // สร้าง session ใหม่
    const sessionId = crypto.randomUUID()
    const token = crypto.randomUUID()
    const timestamp = Date.now()
    const expiresAt = timestamp + (60 * 60 * 24 * 7 * 1000) // 7 days

    await env.DB.prepare(
      "INSERT INTO session (id, userId, expiresAt, token, ipAddress, userAgent, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(sessionId, user.id, expiresAt, token, null, null, timestamp).run()

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: !!user.emailVerified,
        image: user.image,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        token
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

/**
 * ตรวจสอบ session
 */
export async function simpleGetSession(
  env: Env,
  token: string
): Promise<{ user?: any; session?: any }> {
  try {
    const session = await env.DB.prepare(
      "SELECT * FROM session WHERE token = ? AND expiresAt > ?"
    ).bind(token, Date.now()).first() as any

    if (!session) {
      return {}
    }

    const user = await env.DB.prepare(
      "SELECT id, email, name, image FROM user WHERE id = ?"
    ).bind(session.userId).first()

    return { user, session }
  } catch (error) {
    console.error('Get session error:', error)
    return {}
  }
}

