import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useSession } from '@/lib/auth'
import { useEffect } from 'react'

/**
 * Protected Layout Route
 * Layout สำหรับหน้าที่ต้อง login ก่อน (dashboard, profile, settings)
 * ถ้า user ไม่ได้ login จะ redirect ไป login
 */
export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { data: session, isLoading } = useSession()
  const navigate = useNavigate()

  // ใช้ useEffect เพื่อ redirect ถ้า user ไม่ได้ login
  useEffect(() => {
    if (!isLoading && !session) {
      navigate({ to: '/login' })
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

  // ถ้ายังไม่มี session ให้แสดง loading (จะ redirect ใน useEffect)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">กำลังตรวจสอบ...</p>
        </div>
      </div>
    )
  }

  return <Outlet />
}

