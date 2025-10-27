'use server'

import db from '@/lib/firestore'
import { revalidatePath } from 'next/cache'
import { museumFormDataSchema } from '@/schema/museum'
import { FormSubmitState } from '@/schema/common'

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
  await db.collection('museum').doc(data.id).update({
    name: data.name,
    address: data.address,
    access: data.access,
    openingInformation: data.openingInformation,
    officialUrl: data.officialUrl,
    scrapeUrl: data.scrapeUrl,
  })
  console.log('Successfully updated museum with ID:', data.id)

  revalidatePath('/')
  revalidatePath(`/museum/${data.id}/edit`)

  return {
    status: 'success' as const,
    errors: undefined,
  }
}
