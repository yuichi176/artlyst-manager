import ExhibitionTableSection from '@/app/(top-page)/_components/exhibition-table/ExhibitionTableSection'
import { ExhibitionTableSkeleton } from '@/app/(top-page)/_components/exhibition-table/ExhibitionTableSkeleton'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight mb-5">展覧会管理</h2>
      <Suspense fallback={<ExhibitionTableSkeleton />}>
        <ExhibitionTableSection />
      </Suspense>
    </div>
  )
}
