import { MuseumEditFormSection } from '@/app/museum/[id]/edit/_components/MuseumEditFormSection'
import { Suspense } from 'react'
import { MuseumEditFormSkeleton } from '@/app/museum/[id]/edit/_components/MuseumEditFormSkeleton'
import Link from 'next/link'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn-ui/breadcrumb'

export const dynamic = 'force-dynamic'

export default async function MuseumEdit({ params }: { params: Promise<{ id: string }> }) {
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
                <Link href="/museum">美術館一覧</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">美術館編集</h1>
        </div>

        <Suspense fallback={<MuseumEditFormSkeleton />}>
          <MuseumEditFormSection id={id} />
        </Suspense>
      </div>
    </div>
  )
}
