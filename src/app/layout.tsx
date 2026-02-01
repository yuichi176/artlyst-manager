import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SidebarProvider } from '@/components/shadcn-ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/shadcn-ui/sonner'
import { MainLayout } from '@/components/layout/main-layout'
import { cn } from '@/utils'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Artlyst Manager',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={cn('antialiased', geistSans.variable, geistMono.variable)}>
        <SidebarProvider>
          <AppSidebar />
          <MainLayout>
            <Header />
            <div className="p-6">{children}</div>
          </MainLayout>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  )
}
