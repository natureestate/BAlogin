import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

/**
 * Root Route
 * Layout หลักของ application
 */
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      {/* แสดง DevTools เฉพาะใน development mode */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  )
}

