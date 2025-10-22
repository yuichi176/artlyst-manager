import { ExhibitionEditFormSection } from '@/app/exhibition/[id]/edit/_components/ExhibitionEditFormSection'

export const dynamic = 'force-dynamic'

export default async function ExhibitionEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div>
      <ExhibitionEditFormSection id={id} />
    </div>
  )
}
