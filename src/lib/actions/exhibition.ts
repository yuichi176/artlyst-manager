'use server'

import db from '@/lib/firestore'
import { revalidatePath } from 'next/cache'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import { redirect } from 'next/navigation'
import { exhibitionFormDataSchema } from '@/schema/exhibition'

export async function deleteExhibition(id: string) {
  await db.collection('exhibition').doc(id).delete()
  console.log('Successfully deleted exhibition with ID:', id)

  revalidatePath('/')
}

export async function updateExhibition(
  prev:
    | {
        errors: Record<string, string>
      }
    | undefined,
  formData: FormData,
) {
  const formDataObject = Object.fromEntries(formData.entries())

  const parsed = exhibitionFormDataSchema.safeParse(formDataObject)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0] as string
      errors[path] = issue.message
    })
    return {
      errors,
    }
  }

  const data = parsed.data
  await db
    .collection('exhibition')
    .doc(data.id)
    .update({
      title: data.title,
      venue: data.venue,
      startDate: Timestamp.fromDate(new TZDate(data.startDate, 'Asia/Tokyo')),
      endDate: Timestamp.fromDate(new TZDate(data.endDate, 'Asia/Tokyo')),
      status: data.status,
    })
  console.log('Successfully updated exhibition with ID:', data.id)

  revalidatePath('/')
  revalidatePath(`/exhibition/${data.id}/edit`)

  redirect('/exhibition')
}
