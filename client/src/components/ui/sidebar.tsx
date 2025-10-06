import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Sidebar Container Component
 * คอมโพเนนต์หลักสำหรับ Sidebar
 */
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-64 flex-col border-r bg-background",
      className
    )}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

/**
 * Sidebar Header Component
 * ส่วนหัวของ Sidebar
 */
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 border-b px-6 py-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

/**
 * Sidebar Content Component
 * ส่วนเนื้อหาของ Sidebar
 */
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto py-4", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

/**
 * Sidebar Footer Component
 * ส่วนท้ายของ Sidebar
 */
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-t px-6 py-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

/**
 * Sidebar Menu Component
 * เมนูของ Sidebar
 */
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-col gap-1 px-3", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

/**
 * Sidebar Menu Item Component
 * รายการเมนูของ Sidebar
 */
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("list-none", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

/**
 * Sidebar Menu Button Component
 * ปุ่มเมนูของ Sidebar
 */
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
      isActive && "bg-accent text-accent-foreground",
      className
    )}
    {...props}
  />
))
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
}

