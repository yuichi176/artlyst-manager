import { z } from 'zod'

export const exhibitionFormDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '展覧会名は必須項目です。'),
  venue: z.string().min(1, '会場は必須項目です。'),
  startDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), '開始日は有効な日付を入力してください。'),
  endDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), '終了日は有効な日付を入力してください。'),
  status: z.enum(['pending', 'active']),
})
