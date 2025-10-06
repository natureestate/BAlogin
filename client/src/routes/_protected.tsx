import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useSession } from '@/lib/auth'

/**
 * Protected Layout Route
 * Layout สำหรับหน้าที่ต้อง login ก่อน (dashboard, profile, settings)
 * ถ้า user ไม่ได้ login จะ redirect ไป login
 */
export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
  beforeLoad: async () => {
    // ตรวจสอบ session ก่อน load route
    // จะถูกเรียกก่อน component render
  },
})

function ProtectedLayout() {
  const { data: session, isLoading } = useSession()

  // ถ้า user ไม่ได้ login ให้ redirect ไป login
  if (!isLoading && !session) {
    redirect({ to: '/login', throw: true })
  }

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

  return <Outlet />
}

