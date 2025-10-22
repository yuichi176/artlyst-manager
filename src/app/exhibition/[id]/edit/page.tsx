import { ExhibitionEditFormSection } from '@/app/exhibition/[id]/edit/_components/ExhibitionEditFormSection'
import { Suspense } from 'react'
import { ExhibitionTableSkeleton } from '@/app/exhibition/_components/exhibition-table/ExhibitionTableSkeleton'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ExhibitionEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl space-y-6 p-6 pb-16">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/exhibition"
            className="flex items-center hover:text-foreground transition-colors"
          >
            展覧会一覧
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">編集</span>
        </nav>

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
