import db from '@/lib/firestore'
import { RawMuseum } from '@/schema/db'
import { convertRawMuseumToMuseum } from '@/schema/converters'
import { MuseumEditForm } from './MuseumEditForm'
import { notFound } from 'next/navigation'

interface MuseumEditFormSectionProps {
  id: string
}

export const MuseumEditFormSection = async ({ id }: MuseumEditFormSectionProps) => {
  const museumCollectionRef = db.collection('museum').doc(id)
  const existingDocumentsSnapshot = await museumCollectionRef.get()

  if (!existingDocumentsSnapshot.exists) {
    notFound()
  }

  const data = existingDocumentsSnapshot.data() as RawMuseum
  const museum = convertRawMuseumToMuseum(id, data)

  return <MuseumEditForm museum={museum} />
}
