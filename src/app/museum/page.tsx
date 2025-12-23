import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn-ui/breadcrumb'
import Link from 'next/link'
import { Home, Plus } from 'lucide-react'
import { Suspense } from 'react'
import { Button } from '@/components/shadcn-ui/button'
import MuseumTableSection from '@/app/museum/_components/museum-table/MuseumTableSection'
import { MuseumTableSkeleton } from '@/app/museum/_components/museum-table/MuseumTableSkeleton'

export const dynamic = 'force-dynamic'

export default function MuseumListPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>美術館一覧</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold tracking-tight">美術館一覧</h2>
        <Link href="/museum/create">
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            美術館を登録
          </Button>
        </Link>
      </div>
      <Suspense fallback={<MuseumTableSkeleton />}>
        <MuseumTableSection />
      </Suspense>
    </div>
  )
}
