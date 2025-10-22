import ExhibitionTableSection from '@/app/exhibition/_components/exhibition-table/ExhibitionTableSection'
import { ExhibitionTableSkeleton } from '@/app/exhibition/_components/exhibition-table/ExhibitionTableSkeleton'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function ExhibitionListPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight mb-5">展覧会一覧</h2>
      <Suspense fallback={<ExhibitionTableSkeleton />}>
        <ExhibitionTableSection />
      </Suspense>
    </div>
  )
}
