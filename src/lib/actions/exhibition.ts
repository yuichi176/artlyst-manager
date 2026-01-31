'use server'

import db from '@/lib/firestore'
import { revalidatePath } from 'next/cache'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import {
  exhibitionFormDataSchema,
  exhibitionCreateFormDataSchema,
  exhibitionStatusFormDataSchema,
  exhibitionIsExcludedFormDataSchema,
  FormSubmitState,
} from '@/schema/ui'
import { redirect } from 'next/navigation'
import { getExhibitionDocumentHash } from '@/utils'

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
  const id = getExhibitionDocumentHash(data.title, data.venue)
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
      origin: 'manual',
      isExcluded: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
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
      updatedAt: Timestamp.now(),
    })
  console.log('Successfully updated exhibition with ID:', data.id)

  revalidatePath('/')
  revalidatePath(`/exhibition/${data.id}/edit`)

  return {
    status: 'success' as const,
    errors: undefined,
  }
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
    updatedAt: Timestamp.now(),
  })

  console.log('Successfully updated exhibition status with ID:', data.id)

  revalidatePath('/')

  return {
    status: 'success' as const,
    errors: undefined,
  }
}

export async function updateExhibitionIsExcluded(prev: FormSubmitState, formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries())

  const parsed = exhibitionIsExcludedFormDataSchema.safeParse(formDataObject)
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
    isExcluded: data.isExcluded,
    updatedAt: Timestamp.now(),
  })

  console.log('Successfully updated exhibition isExcluded with ID:', data.id)

  revalidatePath('/')

  return {
    status: 'success' as const,
    errors: undefined,
  }
}

export async function restoreExhibition(id: string) {
  await db.collection('exhibition').doc(id).update({
    isExcluded: false,
    updatedAt: Timestamp.now(),
  })

  console.log('Successfully restored exhibition with ID:', id)

  revalidatePath('/')
  revalidatePath('/exhibition/excluded')
}
