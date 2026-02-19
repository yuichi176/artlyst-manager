import { z } from 'zod'
import { statusSchema } from '@/schema/common/exhibition'

/**
 * UI layer schema for Exhibition.
 * Uses ISO date strings instead of Firestore Timestamp for serializability.
 */
export const exhibitionSchema = z.object({
  id: z.string(),
  museumId: z.string(),
  title: z.string(),
  venue: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  officialUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  status: statusSchema,
  origin: z.string().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  eventStatus: z.enum(['ongoing', 'upcoming', 'ended']).optional(),
})
export type Exhibition = z.infer<typeof exhibitionSchema>

export const exhibitionFormDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '展覧会名は必須項目です。'),
  museumId: z.string().min(1, '会場を選択してください。'),
  startDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), '開始日は有効な日付を入力してください。'),
  endDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), '終了日は有効な日付を入力してください。'),
  officialUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  status: statusSchema,
})

export const exhibitionCreateFormDataSchema = exhibitionFormDataSchema.omit({
  id: true,
})
export const exhibitionUpdateFormDataSchema = exhibitionFormDataSchema.omit({
  museumId: true,
})

export const exhibitionStatusFormDataSchema = exhibitionFormDataSchema.pick({
  id: true,
  status: true,
})

export const exhibitionIsExcludedFormDataSchema = z.object({
  id: z.string(),
  isExcluded: z.coerce.boolean(),
})

export const exhibitionOfficialUrlFormDataSchema = z.object({
  id: z.string(),
  officialUrl: z
    .union([
      z.string().refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
        message: 'URLはhttp://またはhttps://で始まる必要があります',
      }),
      z.literal(''),
    ])
    .optional(),
})
