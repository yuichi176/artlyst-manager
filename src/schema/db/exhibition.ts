import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

const statusSchema = z.enum(['pending', 'active'])
export type Status = z.infer<typeof statusSchema>

/**
 * Database layer schema for Exhibition documents in Firestore.
 * Uses Firestore Timestamp for date fields.
 */
export const rawExhibitionSchema = z.object({
  title: z.string(),
  museumId: z.string(),
  venue: z.string(),
  startDate: z.instanceof(Timestamp).optional(),
  endDate: z.instanceof(Timestamp).optional(),
  officialUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  status: statusSchema,
  origin: z.string().optional(),
  isExcluded: z.boolean().optional(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
})
export type RawExhibition = z.infer<typeof rawExhibitionSchema>
