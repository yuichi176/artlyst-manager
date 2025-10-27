import { z } from 'zod'

export const museumSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  access: z.string(),
  openingInformation: z.string(),
  officialUrl: z.string(),
  scrapeUrl: z.string(),
})
export type Museum = z.infer<typeof museumSchema>
