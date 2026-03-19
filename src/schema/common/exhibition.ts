import { z } from 'zod'

export const statusSchema = z.enum(['pending', 'active'])
export type Status = z.infer<typeof statusSchema>

export const genres = [
  '絵画',
  '彫刻',
  '現代アート',
  '写真',
  '工芸',
  'デザイン',
  '建築',
  'イラストレーション',
  'アニメ・マンガ・ゲーム',
  '映画',
  'キャラクター',
  'メディアアート',
  '歴史・考古',
  '自然科学・博物',
  '子ども',
] as const
export const genreSchema = z.enum(genres)
export type Genre = z.infer<typeof genreSchema>
