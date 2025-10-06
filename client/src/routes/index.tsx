import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Landing Page Route
 * หน้าแรกของ application
 */
export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">BAlogin</CardTitle>
          <CardDescription>
            ระบบ Authentication ที่สมบูรณ์แบบ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link to="/login">
              <Button className="w-full" variant="default">
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link to="/register">
              <Button className="w-full" variant="outline">
                สมัครสมาชิก
              </Button>
            </Link>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <span className="px-2 py-1 bg-secondary rounded-md">React</span>
              <span className="px-2 py-1 bg-secondary rounded-md">TypeScript</span>
              <span className="px-2 py-1 bg-secondary rounded-md">TanStack</span>
              <span className="px-2 py-1 bg-secondary rounded-md">Better Auth</span>
              <span className="px-2 py-1 bg-secondary rounded-md">Cloudflare</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

