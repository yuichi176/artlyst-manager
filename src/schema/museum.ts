import { z } from 'zod'

const venueTypeSchema = z.enum(['美術館', '博物館', 'ギャラリー', 'イベントスペース'])
export const venueTypeOptions = venueTypeSchema.options.map((type) => ({
  label: type,
  value: type,
}))

export const areaSchema = z.enum([
  '上野',
  '東京駅・日本橋・京橋',
  '六本木・乃木坂・麻布台',
  '表参道・青山',
  '渋谷・恵比寿・目黒',
  '新宿・初台・四ツ谷',
  '清澄白河・両国・蔵前',
  '文京・水道橋',
  '品川・天王洲',
])
export const areaOptions = areaSchema.options.map((area) => ({
  label: area,
  value: area,
}))

export const museumSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  access: z.string(),
  openingInformation: z.string().optional(),
  venueType: venueTypeSchema,
  area: areaSchema,
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
  openingInformation: z.string().optional(),
  venueType: venueTypeSchema,
  area: areaSchema,
  officialUrl: z.string().min(1, { message: '公式URLは必須項目です。' }),
  scrapeUrl: z.string().min(1, { message: 'スクレイピングURLは必須項目です。' }),
  scrapeEnabled: z.string(),
})

export const museumCreateFormDataSchema = museumFormDataSchema.omit({ id: true })
