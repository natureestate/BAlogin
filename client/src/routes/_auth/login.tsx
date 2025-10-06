import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { signIn } from '@/lib/auth'

/**
 * ตรวจสอบว่าอยู่ใน development mode หรือไม่
 */
const isDevelopment = import.meta.env.MODE === 'development'

/**
 * Login Page Route
 * หน้า Login ของระบบ
 */
export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * จัดการการ login ด้วย email และ password
   */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signIn.email({
        email,
        password,
      })
      
      // Login สำเร็จ redirect ไป dashboard
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * จัดการการ login ด้วย Google
   */
  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      })
    } catch (err) {
      console.error('Google login error:', err)
    }
  }

  /**
   * จัดการการ login ด้วย GitHub
   */
  const handleGitHubLogin = async () => {
    try {
      await signIn.social({
        provider: 'github',
        callbackURL: '/dashboard',
      })
    } catch (err) {
      console.error('GitHub login error:', err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader>
        <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
        <CardDescription>
          กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* แสดง Dev Credentials ใน Development Mode */}
        {isDevelopment && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="font-semibold text-blue-900 mb-1">🔧 Development Mode</p>
            <p className="text-blue-700">
              Email: <code className="bg-blue-100 px-1 rounded">dev@example.com</code>
            </p>
            <p className="text-blue-700">
              Password: <code className="bg-blue-100 px-1 rounded">dev123456</code>
            </p>
          </div>
        )}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>

        {/* แสดง Social Login เฉพาะใน Production */}
        {!isDevelopment && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  หรือเข้าสู่ระบบด้วย
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGitHubLogin}
                disabled={isLoading}
              >
                GitHub
              </Button>
            </div>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground">
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" className="underline underline-offset-4 hover:text-primary">
            สมัครสมาชิก
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

