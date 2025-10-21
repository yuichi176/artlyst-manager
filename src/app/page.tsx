import { ExhibitionTable } from '@/components/exhibitions/exhibition-table'
import { dummyExhibitions } from '@/data/exhibitions'

export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight mb-5">展覧会管理</h2>
      <ExhibitionTable exhibitions={dummyExhibitions} />
    </div>
  )
}
