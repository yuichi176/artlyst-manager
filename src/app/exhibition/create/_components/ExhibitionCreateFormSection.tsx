import db from '@/lib/firestore'
import { RawMuseum } from '@/schema/db'
import { convertRawMuseumToMuseum } from '@/schema/converters'
import { ExhibitionCreateForm } from './ExhibitionCreateForm'

export const ExhibitionCreateFormSection = async () => {
  const museumCollectionRef = db.collection('museum')
  const museumSnapshot = await museumCollectionRef.orderBy('name', 'asc').get()

  const museums = museumSnapshot.docs.map((doc) => {
    const data = doc.data() as RawMuseum
    return convertRawMuseumToMuseum(doc.id, data)
  })

  return <ExhibitionCreateForm museums={museums} />
}
