'use client'

import { useSidebar } from '@/components/shadcn-ui/sidebar'

export const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { open } = useSidebar()

  return (
    <main style={{ width: open ? 'calc(100% - var(--sidebar-width))' : '100%' }}>{children}</main>
  )
}
