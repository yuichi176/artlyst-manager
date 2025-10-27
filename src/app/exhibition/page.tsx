import ExhibitionTableSection from '@/app/exhibition/_components/exhibition-table/ExhibitionTableSection'
import { ExhibitionTableSkeleton } from '@/app/exhibition/_components/exhibition-table/ExhibitionTableSkeleton'
import { Suspense } from 'react'
import Link from 'next/link'
import { Home, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const dynamic = 'force-dynamic'

export default function ExhibitionListPage() {
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
            <BreadcrumbPage>展覧会一覧</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold tracking-tight">展覧会一覧</h2>
        <Link href="/exhibition/create">
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            展覧会を登録
          </Button>
        </Link>
      </div>
      <Suspense fallback={<ExhibitionTableSkeleton />}>
        <ExhibitionTableSection />
      </Suspense>
    </div>
  )
}
