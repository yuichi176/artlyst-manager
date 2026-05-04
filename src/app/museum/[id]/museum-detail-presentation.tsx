import type { Exhibition, Museum } from '@/schema/ui'
import { MuseumExhibitionsTable } from './_components/museum-exhibitions-table'
import { MuseumInfoCard } from './_components/museum-info-card'

interface MuseumDetailPresentationProps {
  museum: Museum
  exhibitions: Exhibition[]
}

export function MuseumDetailPresentation({ museum, exhibitions }: MuseumDetailPresentationProps) {
  return (
    <div className="space-y-8">
      <MuseumInfoCard museum={museum} exhibitionCount={exhibitions.length} />
      <MuseumExhibitionsTable museum={museum} exhibitions={exhibitions} />
    </div>
  )
}
