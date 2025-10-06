import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Home, User, Settings, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { useSession, signOut } from '@/lib/auth'

/**
 * Settings Page Route
 * หน้าการตั้งค่าบัญชี
 */
export const Route = createFileRoute('/_protected/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { data: session } = useSession()
  const navigate = useNavigate()

  /**
   * จัดการการ logout
   */
  const handleLogout = async () => {
    try {
      await signOut()
      navigate({ to: '/' })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="font-bold text-xl">BAlogin</div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="/dashboard">
                <SidebarMenuButton>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link to="/profile">
                <SidebarMenuButton>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link to="/settings">
                <SidebarMenuButton isActive>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{session?.user?.name || session?.user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              จัดการการตั้งค่าบัญชีและความปลอดภัย
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลบัญชี</CardTitle>
              <CardDescription>
                ข้อมูลพื้นฐานเกี่ยวกับบัญชีของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">อีเมล</p>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">ชื่อ</p>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.name || '-'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium">สถานะบัญชี</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    บัญชีใช้งานได้ปกติ
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ความปลอดภัย</CardTitle>
              <CardDescription>
                จัดการการตั้งค่าความปลอดภัยของบัญชี
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <p className="text-sm font-medium">เปลี่ยนรหัสผ่าน</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    อัปเดตรหัสผ่านของคุณเป็นประจำเพื่อความปลอดภัย
                  </p>
                </div>
                <Button variant="outline" disabled>
                  เปลี่ยนรหัสผ่าน
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    เพิ่มความปลอดภัยด้วยการยืนยันตัวตนสองขั้นตอน
                  </p>
                </div>
                <Button variant="outline" disabled>
                  เปิดใช้งาน
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                การดำเนินการที่ไม่สามารถย้อนกลับได้
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-destructive">ลบบัญชี</p>
                  <p className="text-sm text-muted-foreground">
                    ลบบัญชีของคุณและข้อมูลทั้งหมดอย่างถาวร
                  </p>
                </div>
                <Button variant="destructive" disabled>
                  ลบบัญชี
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

