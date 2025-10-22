import { ExhibitionEditFormSection } from '@/app/exhibition/[id]/edit/_components/ExhibitionEditFormSection'
import { Suspense } from 'react'
import { ExhibitionTableSkeleton } from '@/app/exhibition/_components/exhibition-table/ExhibitionTableSkeleton'
import Link from 'next/link'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const dynamic = 'force-dynamic'

export default async function ExhibitionEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div>
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-4 pb-16">
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
              <BreadcrumbPage>編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">展覧会編集</h1>
        </div>

        <Suspense fallback={<ExhibitionTableSkeleton />}>
          <ExhibitionEditFormSection id={id} />
        </Suspense>
      </div>
    </div>
  )
}
