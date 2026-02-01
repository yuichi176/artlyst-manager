'use server'

import db from '@/lib/firestore'
import { revalidatePath } from 'next/cache'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import {
  exhibitionCreateFormDataSchema,
  exhibitionStatusFormDataSchema,
  exhibitionIsExcludedFormDataSchema,
  FormSubmitState,
  exhibitionUpdateFormDataSchema,
} from '@/schema/ui'
import { redirect } from 'next/navigation'
import { getExhibitionDocumentId } from '@/utils'

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

  // Fetch museum name from Firestore
  const museumDoc = await db.collection('museum').doc(data.museumId).get()
  if (!museumDoc.exists) {
    return {
      status: 'error' as const,
      errors: { museumId: '無効な会場が選択されています。' },
    }
  }
  const venue = museumDoc.data()?.name

  const id = getExhibitionDocumentId(data.museumId, data.title)

  // Use transaction to prevent overwriting existing exhibitions
  try {
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection('exhibition').doc(id)
      const doc = await transaction.get(docRef)

      if (doc.exists) {
        throw new Error('EXHIBITION_ALREADY_EXISTS')
      }

      transaction.set(docRef, {
        title: data.title,
        museumId: data.museumId,
        venue,
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
    })
    console.log('Successfully created exhibition with ID:', id)
  } catch (error) {
    if (error instanceof Error && error.message === 'EXHIBITION_ALREADY_EXISTS') {
      return {
        status: 'error' as const,
        errors: { title: 'この展覧会は既に登録されています。' },
      }
    }
    throw error
  }

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

  const parsed = exhibitionUpdateFormDataSchema.safeParse(formDataObject)
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
