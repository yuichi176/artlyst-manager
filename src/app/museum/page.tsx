import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { Suspense } from 'react'
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

      <h2 className="text-2xl font-bold tracking-tight mb-5">美術館一覧</h2>
      <Suspense fallback={<MuseumTableSkeleton />}>
        <MuseumTableSection />
      </Suspense>
    </div>
  )
}
