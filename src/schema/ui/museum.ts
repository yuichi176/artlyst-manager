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
  scrape: z.object({
    enabled: z.boolean(),
    scrapeUrls: z.array(z.string()),
    lastScrapedAt: z.string().optional(),
  }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
export type Museum = z.infer<typeof museumSchema>

const scrapeEnabledFormSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value : ''),
  z.string().refine((value) => value === 'true' || value === 'false', {
    message: 'スクレイピング設定は必須項目です。',
  }),
)

export function parseScrapeUrls(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean)
}

const scrapeUrlsFormSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value : ''),
  z.string(),
).transform(parseScrapeUrls)

const museumFormDataBaseSchema = z.object({
  name: z.string().min(1, { message: '美術館名は必須項目です。' }),
  address: z.string().min(1, { message: '住所は必須項目です。' }),
  access: z.string().min(1, { message: 'アクセス情報は必須項目です。' }),
  openingInformation: z.string().optional(),
  venueType: venueTypeSchema,
  area: areaSchema,
  region: regionSchema,
  officialUrl: z.string().min(1, { message: '公式URLは必須項目です。' }),
  scrapeEnabled: scrapeEnabledFormSchema,
  scrapeUrls: scrapeUrlsFormSchema,
})

export const museumFormDataSchema = museumFormDataBaseSchema.extend({
  id: z.string(),
})

export const museumCreateFormDataSchema = museumFormDataBaseSchema
