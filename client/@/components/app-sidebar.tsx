import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { SearchForm } from "@/components/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Navigation data สำหรับ BAlogin
const data = {
  navMain: [
    {
      title: "หน้าหลัก",
      url: "/dashboard",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          isActive: true,
        },
        {
          title: "ภาพรวม",
          url: "/overview",
        },
      ],
    },
    {
      title: "จัดการบัญชี",
      url: "#",
      items: [
        {
          title: "โปรไฟล์",
          url: "/profile",
        },
        {
          title: "ตั้งค่า",
          url: "/settings",
        },
        {
          title: "ความปลอดภัย",
          url: "/security",
        },
      ],
    },
    {
      title: "ข้อมูลระบบ",
      url: "#",
      items: [
        {
          title: "สถิติการใช้งาน",
          url: "/analytics",
        },
        {
          title: "บันทึกกิจกรรม",
          url: "/logs",
        },
        {
          title: "การจัดการผู้ใช้",
          url: "/users",
        },
      ],
    },
    {
      title: "ช่วยเหลือ",
      url: "#",
      items: [
        {
          title: "คู่มือการใช้งาน",
          url: "/help",
        },
        {
          title: "ติดต่อเรา",
          url: "/contact",
        },
        {
          title: "เกี่ยวกับเรา",
          url: "/about",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">BAlogin</span>
                  <span className="">ระบบ Authentication</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                            >
                              <Link to={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
