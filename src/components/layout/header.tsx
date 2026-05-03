import { SidebarTrigger } from '@/components/shadcn-ui/sidebar'
import { Badge } from '@/components/shadcn-ui/badge'

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production'

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Artlyst Manager</h1>
          {!isProduction && <Badge>Dev</Badge>}
        </div>
      </div>
    </header>
  )
}
