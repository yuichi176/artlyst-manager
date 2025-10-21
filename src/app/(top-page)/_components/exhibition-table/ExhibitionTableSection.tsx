import { dummyExhibitions } from '@/data/exhibitions'
import { ExhibitionTable } from '@/app/(top-page)/_components/exhibition-table/ExhibitionTableTemplate'

export default function ExhibitionTableSection() {
  return <ExhibitionTable exhibitions={dummyExhibitions} />
}
