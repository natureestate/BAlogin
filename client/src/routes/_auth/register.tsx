import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { signUp, signIn } from '@/lib/auth'

/**
 * ตรวจสอบว่าอยู่ใน development mode หรือไม่
 */
const isDevelopment = import.meta.env.MODE === 'development'

/**
 * Register Page Route
 * หน้าสมัครสมาชิกของระบบ
 */
export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * จัดการการสมัครสมาชิก
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // ตรวจสอบรหัสผ่าน
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    if (password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      return
    }

    setIsLoading(true)

    try {
      await signUp.email({
        email,
        password,
        name,
      })
      
      // สมัครสมาชิกสำเร็จ redirect ไป dashboard
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง')
      console.error('Register error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * จัดการการสมัครด้วย Google
   */
  const handleGoogleSignup = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      })
    } catch (err) {
      console.error('Google signup error:', err)
    }
  }

  /**
   * จัดการการสมัครด้วย GitHub
   */
  const handleGitHubSignup = async () => {
    try {
      await signIn.social({
        provider: 'github',
        callbackURL: '/dashboard',
      })
    } catch (err) {
      console.error('GitHub signup error:', err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader>
        <CardTitle className="text-2xl">สมัครสมาชิก</CardTitle>
        <CardDescription>
          สร้างบัญชีใหม่เพื่อเริ่มใช้งาน
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ</Label>
            <Input
              id="name"
              type="text"
              placeholder="ชื่อของคุณ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
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
                  หรือสมัครด้วย
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGitHubSignup}
                disabled={isLoading}
              >
                GitHub
              </Button>
            </div>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="underline underline-offset-4 hover:text-primary">
            เข้าสู่ระบบ
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

