import db from '@/lib/firestore'
import { RawExhibition, RawMuseum } from '@/schema/db'
import { convertRawExhibitionToExhibition, convertRawMuseumToMuseum } from '@/schema/converters'
import { ExhibitionEditFormPresentation } from './exhibition-edit-form-presentation'
import { notFound } from 'next/navigation'

interface ExhibitionEditFormSectionProps {
  id: string
}

export default async function ExhibitionEditFormSection({ id }: ExhibitionEditFormSectionProps) {
  const exhibitionCollectionRef = db.collection('exhibition').doc(id)
  const existingDocumentsSnapshot = await exhibitionCollectionRef.get()

  if (!existingDocumentsSnapshot.exists) {
    notFound()
  }

  const data = existingDocumentsSnapshot.data() as RawExhibition
  const exhibition = convertRawExhibitionToExhibition(id, data)

  const museumCollectionRef = db.collection('museum')
  const museumSnapshot = await museumCollectionRef.orderBy('name', 'asc').get()

  const museums = museumSnapshot.docs.map((doc) => {
    const data = doc.data() as RawMuseum
    return convertRawMuseumToMuseum(doc.id, data)
  })

  return <ExhibitionEditFormPresentation exhibition={exhibition} museums={museums} />
}
