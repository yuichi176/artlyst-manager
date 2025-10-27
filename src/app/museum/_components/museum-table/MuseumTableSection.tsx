import db from '@/lib/firestore'
import { Museum } from '@/schema/museum'
import { MuseumTable } from '@/app/museum/_components/museum-table/MuseumTable'

export default async function MuseumTableSection() {
  const museumCollectionRef = db.collection('museum')
  const existingDocumentsSnapshot = await museumCollectionRef.get()

  const museums = existingDocumentsSnapshot.docs.map((doc) => {
    const data = doc.data() as Museum

    return {
      id: doc.id,
      name: data.name,
      address: data.address,
      access: data.access,
      openingInformation: data.openingInformation,
      officialUrl: data.officialUrl,
      scrapeUrl: data.scrapeUrl,
    } satisfies Museum
  })

  return <MuseumTable museums={museums} />
}
