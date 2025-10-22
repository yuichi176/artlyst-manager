import { ExhibitionEditFormSection } from '@/app/exhibition/[id]/edit/_components/ExhibitionEditFormSection'
import { Suspense } from 'react'
import { ExhibitionTableSkeleton } from '@/app/exhibition/_components/exhibition-table/ExhibitionTableSkeleton'

export const dynamic = 'force-dynamic'

export default async function ExhibitionEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight mb-5">展覧会編集</h2>
      <Suspense fallback={<ExhibitionTableSkeleton />}>
        <ExhibitionEditFormSection id={id} />
      </Suspense>
    </div>
  )
}
