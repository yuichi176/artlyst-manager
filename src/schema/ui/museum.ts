import { z } from 'zod'
import { areaSchema, regionSchema, venueTypeSchema } from '@/schema/common/museum'

export const venueTypeOptions = venueTypeSchema.options.map((type) => ({
  label: type,
  value: type,
}))

export const areaOptions = areaSchema.options.map((area) => ({
  label: area,
  value: area,
}))

export const regionOptions = regionSchema.options.map((region) => ({
  label: region,
  value: region,
}))

/**
 * UI layer schema for Museum.
 * Uses ISO date strings for timestamps (optional for backward compatibility).
 */
export const museumSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  access: z.string(),
  openingInformation: z.string().optional(),
  venueType: venueTypeSchema,
  area: areaSchema,
  region: regionSchema,
  officialUrl: z.string(),
  scrapeUrl: z.string(),
  scrapeEnabled: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
export type Museum = z.infer<typeof museumSchema>

export const museumFormDataSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: '美術館名は必須項目です。' }),
  address: z.string().min(1, { message: '住所は必須項目です。' }),
  access: z.string().min(1, { message: 'アクセス情報は必須項目です。' }),
  openingInformation: z.string().optional(),
  venueType: venueTypeSchema,
  area: areaSchema,
  region: regionSchema,
  officialUrl: z.string().min(1, { message: '公式URLは必須項目です。' }),
  scrapeUrl: z.string().min(1, { message: 'スクレイピングURLは必須項目です。' }),
  scrapeEnabled: z.string(),
})

export const museumCreateFormDataSchema = museumFormDataSchema.omit({ id: true })
