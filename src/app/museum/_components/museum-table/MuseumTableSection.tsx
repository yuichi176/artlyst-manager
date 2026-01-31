import db from '@/lib/firestore'
import { RawMuseum } from '@/schema/db'
import { convertRawMuseumToMuseum } from '@/schema/converters'
import { MuseumTable } from '@/app/museum/_components/museum-table/MuseumTable'

export default async function MuseumTableSection() {
  const museumCollectionRef = db.collection('museum')
  const existingDocumentsSnapshot = await museumCollectionRef.get()

  const museums = existingDocumentsSnapshot.docs.map((doc) => {
    const data = doc.data() as RawMuseum
    return convertRawMuseumToMuseum(doc.id, data)
  })

  return <MuseumTable museums={museums} />
}
