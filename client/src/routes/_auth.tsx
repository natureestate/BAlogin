import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useSession } from '@/lib/auth'

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

  // ถ้า user login แล้วให้ redirect ไป dashboard
  if (!isLoading && session) {
    redirect({ to: '/dashboard', throw: true })
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Outlet />
    </div>
  )
}

