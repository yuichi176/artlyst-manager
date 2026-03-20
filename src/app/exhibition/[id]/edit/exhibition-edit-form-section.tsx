import db from '@/lib/firestore'
import { RawExhibition } from '@/schema/db'
import { convertRawExhibitionToExhibition } from '@/schema/converters'
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

  return <ExhibitionEditFormPresentation exhibition={exhibition} />
}
