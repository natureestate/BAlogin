import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useSession } from '@/lib/auth'
import { useEffect } from 'react'

/**
 * Auth Layout Route
 * Layout สำหรับหน้า authentication (login, register)
 * ถ้า user login แล้วจะ redirect ไป dashboard
 */
export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const { data: session, isLoading } = useSession()
  const navigate = useNavigate()

  // ใช้ useEffect เพื่อ redirect ถ้า user login แล้ว
  useEffect(() => {
    if (!isLoading && session) {
      navigate({ to: '/dashboard' })
    }
  }, [isLoading, session, navigate])

  // แสดง loading state ขณะตรวจสอบ session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  // ถ้ามี session แล้วให้แสดง loading (จะ redirect ใน useEffect)
  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">กำลังเข้าสู่ระบบ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Outlet />
    </div>
  )
}

