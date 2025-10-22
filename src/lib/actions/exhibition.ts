'use server'

import db from '@/lib/firestore'
import { revalidatePath } from 'next/cache'
import type { Exhibition } from '@/types/exhibition'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import { redirect } from 'next/navigation'

export async function deleteExhibition(id: string) {
  await db.collection('exhibition').doc(id).delete()
  console.log('Successfully deleted exhibition with ID:', id)

  revalidatePath('/')
}

export async function updateExhibition(id: string, data: Omit<Exhibition, 'id'>) {
  await db
    .collection('exhibition')
    .doc(id)
    .update({
      title: data.title,
      venue: data.venue,
      startDate: data.startDate ? Timestamp.fromDate(new TZDate(data.startDate, 'Asia/Tokyo')) : '',
      endDate: data.endDate ? Timestamp.fromDate(new TZDate(data.endDate, 'Asia/Tokyo')) : '',
      status: data.status,
    })
  console.log('Successfully updated exhibition with ID:', id)

  revalidatePath('/')
  revalidatePath(`/exhibition/${id}/edit`)

  redirect('/exhibition')
}
