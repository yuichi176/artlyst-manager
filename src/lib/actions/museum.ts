'use server'

import db from '@/lib/firestore'
import { revalidatePath } from 'next/cache'
import { Timestamp } from '@google-cloud/firestore'
import { museumFormDataSchema, museumCreateFormDataSchema, FormSubmitState } from '@/schema/ui'
import { redirect } from 'next/navigation'

export async function createMuseum(prev: FormSubmitState, formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries())

  const parsed = museumCreateFormDataSchema.safeParse(formDataObject)
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
  const scrapeEnabled = data.scrapeEnabled === 'true'
  const docRef = await db.collection('museum').add({
    name: data.name,
    aliases: data.aliases,
    address: data.address,
    access: data.access,
    openingInformation: data.openingInformation,
    venueType: data.venueType,
    area: data.area,
    region: data.region,
    officialUrl: data.officialUrl,
    scrape: {
      enabled: scrapeEnabled,
      scrapeUrls: scrapeEnabled ? data.scrapeUrls : [],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  console.log('Successfully created museum with ID:', docRef.id)

  revalidatePath('/')

  redirect('/museum')
}

export async function deleteMuseum(id: string) {
  await db.collection('museum').doc(id).delete()
  console.log('Successfully deleted museum with ID:', id)

  revalidatePath('/')
}

export async function updateMuseum(prev: FormSubmitState, formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries())

  const parsed = museumFormDataSchema.safeParse(formDataObject)
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
  const scrapeEnabled = data.scrapeEnabled === 'true'
  await db
    .collection('museum')
    .doc(data.id)
    .update({
      name: data.name,
      aliases: data.aliases,
      address: data.address,
      access: data.access,
      openingInformation: data.openingInformation,
      venueType: data.venueType,
      area: data.area,
      region: data.region,
      officialUrl: data.officialUrl,
      'scrape.enabled': scrapeEnabled,
      'scrape.scrapeUrls': scrapeEnabled ? data.scrapeUrls : [],
      updatedAt: Timestamp.now(),
    })
  console.log('Successfully updated museum with ID:', data.id)

  revalidatePath('/')
  revalidatePath(`/museum/${data.id}/edit`)

  return {
    status: 'success' as const,
    errors: undefined,
  }
}
