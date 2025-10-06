import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

// Import route tree
import { routeTree } from './routeTree.gen'

/**
 * สร้าง QueryClient สำหรับ TanStack Query
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 นาที
      gcTime: 5 * 60 * 1000, // 5 นาที
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

/**
 * สร้าง Router instance
 */
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Type augmentation สำหรับ router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/**
 * Render app
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
