'use server'

import db from '@/lib/firestore'
import { revalidatePath } from 'next/cache'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import {
  exhibitionFormDataSchema,
  exhibitionCreateFormDataSchema,
  exhibitionStatusFormDataSchema,
} from '@/schema/exhibition'
import { FormSubmitState } from '@/schema/common'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

export async function createExhibition(prev: FormSubmitState, formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries())

  const parsed = exhibitionCreateFormDataSchema.safeParse(formDataObject)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0] as string
      errors[path] = issue.message
    })
    return {
      status: 'error' as const,
      errors,
    }
  }

  const data = parsed.data
  const id = getDocumentHash(data.title, data.venue)
  await db
    .collection('exhibition')
    .doc(id)
    .set({
      title: data.title,
      venue: data.venue,
      startDate: Timestamp.fromDate(new TZDate(data.startDate, 'Asia/Tokyo')),
      endDate: Timestamp.fromDate(new TZDate(data.endDate, 'Asia/Tokyo')),
      officialUrl: data.officialUrl || '',
      imageUrl: data.imageUrl || '',
      status: data.status,
    })
  console.log('Successfully created exhibition with ID:', id)

  revalidatePath('/')

  redirect('/exhibition')
}

export async function deleteExhibition(id: string) {
  await db.collection('exhibition').doc(id).delete()
  console.log('Successfully deleted exhibition with ID:', id)

  revalidatePath('/')
}

export async function updateExhibition(prev: FormSubmitState, formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries())

  const parsed = exhibitionFormDataSchema.safeParse(formDataObject)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0] as string
      errors[path] = issue.message
    })
    return {
      status: 'error' as const,
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
      officialUrl: data.officialUrl || '',
      imageUrl: data.imageUrl || '',
      status: data.status,
    })
  console.log('Successfully updated exhibition with ID:', data.id)

  revalidatePath('/')
  revalidatePath(`/exhibition/${data.id}/edit`)

  return {
    status: 'success' as const,
    errors: undefined,
  }
}

function getDocumentHash(title: string, venue: string): string {
  // Remove all whitespace characters for consistent hashing
  const cleanedTitle = title.replace(/\s+/g, '')
  const cleanedVenue = venue.replace(/\s+/g, '')

  return crypto.createHash('md5').update(`${cleanedTitle}_${cleanedVenue}`).digest('hex')
}

export async function updateExhibitionStatus(prev: FormSubmitState, formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries())

  const parsed = exhibitionStatusFormDataSchema.safeParse(formDataObject)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0] as string
      errors[path] = issue.message
    })
    return {
      status: 'error' as const,
      errors,
    }
  }

  const data = parsed.data

  await db.collection('exhibition').doc(data.id).update({
    status: data.status,
  })

  console.log('Successfully updated exhibition status with ID:', data.id)

  revalidatePath('/')
  revalidatePath(`/exhibition/${data.id}/edit`)

  return {
    status: 'success' as const,
    errors: undefined,
  }
}
