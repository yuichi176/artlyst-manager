import db from '@/lib/firestore'

interface ExhibitionEditFormSectionProps {
  id: string
}

export const ExhibitionEditFormSection = async ({ id }: ExhibitionEditFormSectionProps) => {
  const exhibitionCollectionRef = db.collection('exhibition').doc(id)
  const existingDocumentsSnapshot = await exhibitionCollectionRef.get()
  const exhibition = existingDocumentsSnapshot.data()

  console.log(exhibition)

  return <div>Exhibition Edit Form Section</div>
}
