'use server'

import db from '@/lib/firestore'
import { revalidatePath } from 'next/cache'

export async function deleteExhibition(id: string) {
  await db.collection('exhibition').doc(id).delete()
  console.log('Successfully deleted exhibition with ID:', id)

  revalidatePath('/')
}
