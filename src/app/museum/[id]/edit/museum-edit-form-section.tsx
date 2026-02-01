import db from '@/lib/firestore'
import { RawMuseum } from '@/schema/db'
import { convertRawMuseumToMuseum } from '@/schema/converters'
import { MuseumEditFormPresentation } from './museum-edit-form-presentation'
import { notFound } from 'next/navigation'

interface MuseumEditFormSectionProps {
  id: string
}

export default async function MuseumEditFormSection({ id }: MuseumEditFormSectionProps) {
  const museumCollectionRef = db.collection('museum').doc(id)
  const existingDocumentsSnapshot = await museumCollectionRef.get()

  if (!existingDocumentsSnapshot.exists) {
    notFound()
  }

  const data = existingDocumentsSnapshot.data() as RawMuseum
  const museum = convertRawMuseumToMuseum(id, data)

  return <MuseumEditFormPresentation museum={museum} />
}
