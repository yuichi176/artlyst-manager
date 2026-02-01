import db from '@/lib/firestore'
import { RawMuseum } from '@/schema/db'
import { convertRawMuseumToMuseum } from '@/schema/converters'
import { ExhibitionCreateFormPresentation } from './exhibition-create-form-presentation'

export default async function ExhibitionCreateFormSection() {
  const museumCollectionRef = db.collection('museum')
  const museumSnapshot = await museumCollectionRef.orderBy('name', 'asc').get()

  const museums = museumSnapshot.docs.map((doc) => {
    const data = doc.data() as RawMuseum
    return convertRawMuseumToMuseum(doc.id, data)
  })

  return <ExhibitionCreateFormPresentation museums={museums} />
}
