import ExhibitionTableSection from './exhibition-table-section'
import ExhibitionTableSkeleton from './exhibition-table-skeleton'
import { Suspense } from 'react'
import Link from 'next/link'
import { Home, Plus } from 'lucide-react'
import { Button } from '@/components/shadcn-ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn-ui/breadcrumb'

export const dynamic = 'force-dynamic'

export default async function ExhibitionListPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>
}) {
  const page = (await searchParams).page ?? '1'

  return (
    <>
      <div className="mb-6">
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
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">展覧会一覧</h2>
        <Link href="/exhibition/create">
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            展覧会を登録
          </Button>
        </Link>
      </div>
      <Suspense fallback={<ExhibitionTableSkeleton />}>
        <ExhibitionTableSection currentPage={Number(page)} />
      </Suspense>
    </>
  )
}
