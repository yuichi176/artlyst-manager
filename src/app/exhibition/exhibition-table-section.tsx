import { ExhibitionTablePresentation } from './exhibition-table-presentation'
import db from '@/lib/firestore'
import { RawExhibition, RawMuseum } from '@/schema/db'
import { Exhibition, Museum } from '@/schema/ui'
import { convertRawExhibitionToExhibition, convertRawMuseumToMuseum } from '@/schema/converters'

export default async function ExhibitionTableSection() {
  const baseQuery = db
    .collection('exhibition')
    .where('isExcluded', '!=', true)
    .orderBy('createdAt', 'desc')

  // Fetch museums for filter options
  const museumsSnapshot = await db.collection('museum').get()
  const museums: Museum[] = museumsSnapshot.docs.map((doc) => {
    const data = doc.data() as RawMuseum
    return convertRawMuseumToMuseum(doc.id, data)
  })

  const pageSnapshot = await baseQuery.get()
  const allDocs = pageSnapshot.docs

  const exhibitions: Exhibition[] = allDocs.map((doc) => {
    const data = doc.data() as RawExhibition
    return convertRawExhibitionToExhibition(doc.id, data)
  })

  return (
    <>
      <ExhibitionTablePresentation exhibitions={exhibitions} museums={museums} />
    </>
  )
}
