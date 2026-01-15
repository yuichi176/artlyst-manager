import { SidebarTrigger } from '@/components/shadcn-ui/sidebar'

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Artlyst Manager</h1>
      </div>
    </header>
  )
}
