import { ExhibitionTable } from '@/app/exhibition/_components/exhibition-table/ExhibitionTable'
import db from '@/lib/firestore'
import { Timestamp } from '@google-cloud/firestore'
import { Exhibition } from '@/types/exhibition'

export default async function ExhibitionTableSection() {
  const exhibitionCollectionRef = db.collection('exhibition')
  const existingDocumentsSnapshot = await exhibitionCollectionRef.get()

  const exhibitions = existingDocumentsSnapshot.docs.map((doc) => {
    const data = doc.data() as {
      title: string
      venue: string
      startDate?: Timestamp
      endDate?: Timestamp
      status: 'pending' | 'active'
      updatedAt: Timestamp
      createdAt: Timestamp
    }

    return {
      id: doc.id,
      title: data.title,
      venue: data.venue ? data.venue : '',
      startDate: data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '',
      endDate: data.endDate ? data.endDate.toDate().toISOString().split('T')[0] : '',
      status: data.status,
    } satisfies Exhibition
  })

  return <ExhibitionTable exhibitions={exhibitions} />
}
