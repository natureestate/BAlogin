import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, User, Settings, LogOut, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { useSession, signOut } from '@/lib/auth'

/**
 * Profile Page Route
 * หน้าแก้ไข Profile
 */
export const Route = createFileRoute('/_protected/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: session } = useSession()
  const navigate = useNavigate()
  const [name, setName] = useState(session?.user?.name || '')
  const [image, setImage] = useState(session?.user?.image || '')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  /**
   * จัดการการบันทึก Profile
   */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, image }),
      })

      if (response.ok) {
        setMessage('บันทึกข้อมูลสำเร็จ')
        // Refresh session
        window.location.reload()
      } else {
        setMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      }
    } catch (err) {
      setMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      console.error('Save profile error:', err)
    } finally {
      setIsLoading(false)
    }
  }

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
                <SidebarMenuButton isActive>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link to="/settings">
                <SidebarMenuButton>
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
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              จัดการข้อมูลส่วนตัวของคุณ
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลส่วนตัว</CardTitle>
              <CardDescription>
                แก้ไขข้อมูลส่วนตัวและรูปโปรไฟล์ของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={image || undefined} />
                    <AvatarFallback className="text-2xl">
                      {name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="image">URL รูปโปรไฟล์</Label>
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="ชื่อของคุณ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    อีเมลไม่สามารถเปลี่ยนแปลงได้
                  </p>
                </div>

                {message && (
                  <p className={`text-sm ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-destructive'}`}>
                    {message}
                  </p>
                )}

                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

