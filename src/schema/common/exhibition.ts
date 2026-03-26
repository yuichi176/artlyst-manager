import { z } from 'zod'

export const statusSchema = z.enum(['pending', 'active'])
export type Status = z.infer<typeof statusSchema>

export const genres = [
  '絵画・平面',
  '日本画・浮世絵',
  '絵本',
  '彫刻・立体',
  '版画',
  '書道',
  '工芸・民藝',
  '陶芸',
  '写真',
  '現代アート',
  'メディアアート',
  'インスタレーション',
  'パフォーマンス',
  '建築',
  'デザイン',
  'アニメ・マンガ・ゲーム',
  'イラストレーション',
  'キャラクター',
  'ファッション',
  '映像・映画',
  '歴史・考古',
  '自然・科学',
  '子ども',
] as const
export const genreSchema = z.enum(genres)
export type Genre = z.infer<typeof genreSchema>
