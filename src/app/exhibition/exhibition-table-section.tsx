import { ExhibitionTablePresentation } from './exhibition-table-presentation'
import db from '@/lib/firestore'
import { RawExhibition } from '@/schema/db'
import { Exhibition } from '@/schema/ui'
import { convertRawExhibitionToExhibition } from '@/schema/converters'
import { PaginationSection } from '@/components'

const PAGE_SIZE = 100

interface ExhibitionTableSectionProps {
  currentPage: number
}

export default async function ExhibitionTableSection({ currentPage }: ExhibitionTableSectionProps) {
  const baseQuery = db
    .collection('exhibition')
    .where('isExcluded', '!=', true)
    .orderBy('createdAt', 'desc')

  // 件数カウント
  const totalSnapshot = await baseQuery.get()
  const totalCount = totalSnapshot.size

  // 現在ページまでをまとめて取得して最後の PAGE_SIZE 件だけ使う簡易実装
  const limitForPage = currentPage * PAGE_SIZE
  const pageSnapshot = await baseQuery.limit(limitForPage).get()
  const allDocs = pageSnapshot.docs
  const pageDocs = allDocs.slice(-PAGE_SIZE)

  const exhibitions: Exhibition[] = pageDocs.map((doc) => {
    const data = doc.data() as RawExhibition
    return convertRawExhibitionToExhibition(doc.id, data)
  })

  return (
    <>
      <ExhibitionTablePresentation exhibitions={exhibitions} />
      <PaginationSection pageSize={PAGE_SIZE} totalCount={totalCount} currentPage={currentPage} />
    </>
  )
}
