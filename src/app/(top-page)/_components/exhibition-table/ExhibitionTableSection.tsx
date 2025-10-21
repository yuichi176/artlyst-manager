import { dummyExhibitions } from '@/data/exhibitions'
import { ExhibitionTable } from '@/app/(top-page)/_components/exhibition-table/ExhibitionTable'
import { setTimeout } from 'node:timers/promises'

export default async function ExhibitionTableSection() {
  await setTimeout(3000)

  return <ExhibitionTable exhibitions={dummyExhibitions} />
}
