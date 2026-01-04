import { z } from 'zod'

const venueTypeSchema = z.enum(['美術館', '博物館', 'ギャラリー'])
export type VenueType = z.infer<typeof venueTypeSchema>
export const venueTypeOptions = [
  { label: '美術館', value: '美術館' },
  { label: '博物館', value: '博物館' },
  { label: 'ギャラリー', value: 'ギャラリー' },
] satisfies {
  label: string
  value: VenueType
}[]

export const museumSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  access: z.string(),
  openingInformation: z.string(),
  venueType: venueTypeSchema,
  officialUrl: z.string(),
  scrapeUrl: z.string(),
  scrapeEnabled: z.boolean(),
})
export type Museum = z.infer<typeof museumSchema>

export const museumFormDataSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: '美術館名は必須項目です。' }),
  address: z.string().min(1, { message: '住所は必須項目です。' }),
  access: z.string().min(1, { message: 'アクセス情報は必須項目です。' }),
  openingInformation: z.string().min(1, { message: '開館情報は必須項目です。' }),
  venueType: venueTypeSchema,
  officialUrl: z.string().min(1, { message: '公式URLは必須項目です。' }),
  scrapeUrl: z.string().min(1, { message: 'スクレイピングURLは必須項目です。' }),
  scrapeEnabled: z.string(),
})

export const museumCreateFormDataSchema = museumFormDataSchema.omit({ id: true })
