import { z } from 'zod'

const venueTypeSchema = z.enum(['美術館', '博物館', 'ギャラリー', 'イベントスペース', '商業施設'])
export const venueTypeOptions = venueTypeSchema.options.map((type) => ({
  label: type,
  value: type,
}))

export const areaSchema = z.enum([
  '上野',
  '浅草・押上（スカイツリー）',
  '銀座・丸の内',
  '京橋・日本橋・八重洲',
  '表参道・青山・外苑前',
  '渋谷',
  '恵比寿・目黒・白金',
  '六本木・乃木坂・麻布台',
  '新宿・初台・四ツ谷・早稲田',
  '池袋・目白・護国寺',
  '水道橋・後楽園',
  '品川・天王洲アイル',
  '清澄白河・両国・蔵前',
  '汐留・新橋・虎ノ門',
  'お台場・豊洲・有明',
  '中野・高円寺・吉祥寺',
  '三軒茶屋・二子玉川・世田谷',
  '武蔵野・三鷹・調布',
  '小金井・府中・多摩',
  '立川・八王子・多摩センター',
])
export const areaOptions = areaSchema.options.map((area) => ({
  label: area,
  value: area,
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
  officialUrl: z.string().min(1, { message: '公式URLは必須項目です。' }),
  scrapeUrl: z.string().min(1, { message: 'スクレイピングURLは必須項目です。' }),
  scrapeEnabled: z.string(),
})

export const museumCreateFormDataSchema = museumFormDataSchema.omit({ id: true })
