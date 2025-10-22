import db from '@/lib/firestore'
import type { Exhibition } from '@/schema/exhibition'
import { ExhibitionEditForm } from './ExhibitionEditForm'
import { notFound } from 'next/navigation'
import { Timestamp } from '@google-cloud/firestore'

interface ExhibitionEditFormSectionProps {
  id: string
}

export const ExhibitionEditFormSection = async ({ id }: ExhibitionEditFormSectionProps) => {
  const exhibitionCollectionRef = db.collection('exhibition').doc(id)
  const existingDocumentsSnapshot = await exhibitionCollectionRef.get()

  if (!existingDocumentsSnapshot.exists) {
    notFound()
  }

  const data = existingDocumentsSnapshot.data() as {
    title: string
    venue: string
    startDate?: Timestamp
    endDate?: Timestamp
    status: 'pending' | 'active'
    updatedAt: Timestamp
    createdAt: Timestamp
  }

  const exhibition: Exhibition = {
    id: id,
    title: data.title,
    venue: data.venue ? data.venue : '',
    startDate: data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '',
    endDate: data.endDate ? data.endDate.toDate().toISOString().split('T')[0] : '',
    status: data.status,
  } satisfies Exhibition

  return <ExhibitionEditForm exhibition={exhibition} />
}
