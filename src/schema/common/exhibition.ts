import { z } from 'zod'

export const statusSchema = z.enum(['pending', 'active'])
export type Status = z.infer<typeof statusSchema>
