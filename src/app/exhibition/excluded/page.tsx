import ExcludedExhibitionTableSection from '@/app/exhibition/excluded/_components/ExcludedExhibitionTableSection'
import { ExhibitionTableSkeleton } from '@/app/exhibition/_components/exhibition-table/ExhibitionTableSkeleton'
import { Suspense } from 'react'
import Link from 'next/link'
import { Home, RotateCcw } from 'lucide-react'
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

export default async function ExcludedExhibitionListPage({
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
              <BreadcrumbLink asChild>
                <Link href="/exhibition">展覧会一覧</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>除外展覧会</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">除外展覧会一覧</h2>
        <Link href="/exhibition">
          <Button variant="outline" className="cursor-pointer">
            <RotateCcw className="h-4 w-4" />
            通常の一覧に戻る
          </Button>
        </Link>
      </div>
      <Suspense fallback={<ExhibitionTableSkeleton />}>
        <ExcludedExhibitionTableSection currentPage={Number(page)} />
      </Suspense>
    </>
  )
}
