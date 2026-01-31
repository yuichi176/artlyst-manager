import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

const venueTypeSchema = z.enum(['美術館', '博物館', 'ギャラリー', 'イベントスペース'])

const areaSchema = z.enum([
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

/**
 * Database layer schema for Museum documents in Firestore.
 * Uses Firestore Timestamp for date fields.
 * createdAt and updatedAt are optional for backward compatibility.
 */
export const rawMuseumSchema = z.object({
  name: z.string(),
  address: z.string(),
  access: z.string(),
  openingInformation: z.string().optional(),
  venueType: venueTypeSchema,
  area: areaSchema,
  officialUrl: z.string(),
  scrapeUrl: z.string(),
  scrapeEnabled: z.boolean(),
  createdAt: z.instanceof(Timestamp).optional(),
  updatedAt: z.instanceof(Timestamp).optional(),
})

export type RawMuseum = z.infer<typeof rawMuseumSchema>
