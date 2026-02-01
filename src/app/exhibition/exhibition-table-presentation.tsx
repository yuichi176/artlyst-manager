'use client'

import { useState } from 'react'
import type { Exhibition, Museum } from '@/schema/ui'
import { DeleteExhibitionModal } from '@/app/exhibition/_components/modal/delete-exhibition-modal'
import { ExcludeExhibitionModal } from '@/app/exhibition/_components/modal/exclude-exhibition-modal'
import { DataTable } from '@/app/exhibition/_components/data-table'
import { columns, type ExhibitionTableMeta } from '@/app/exhibition/_components/columns'

interface ExhibitionTableProps {
  exhibitions: Exhibition[]
  museums: Museum[]
}

export function ExhibitionTablePresentation({ exhibitions, museums }: ExhibitionTableProps) {
  const [deletingExhibition, setDeletingExhibition] = useState<Exhibition | undefined>(undefined)
  const [excludingExhibition, setExcludingExhibition] = useState<Exhibition | undefined>(undefined)

  const tableMeta: ExhibitionTableMeta = {
    onDelete: setDeletingExhibition,
    onExclude: setExcludingExhibition,
  }

  return (
    <>
      <DataTable columns={columns} data={exhibitions} museums={museums} meta={tableMeta} />

      <DeleteExhibitionModal
        exhibition={deletingExhibition}
        open={deletingExhibition !== undefined}
        onOpenChange={(open) => {
          if (!open) setDeletingExhibition(undefined)
        }}
      />

      <ExcludeExhibitionModal
        exhibition={excludingExhibition}
        open={excludingExhibition !== undefined}
        onOpenChange={(open) => {
          if (!open) setExcludingExhibition(undefined)
        }}
      />
    </>
  )
}
