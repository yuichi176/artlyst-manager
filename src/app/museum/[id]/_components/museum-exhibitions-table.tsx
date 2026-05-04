'use client'

import { useState } from 'react'
import { Column, ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Ban, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Exhibition, Museum } from '@/schema/ui'
import { DataTable } from '@/app/exhibition/_components/data-table'
import { EditableGenreCell } from '@/app/exhibition/_components/editable-genre-cell'
import { EditableUrlCell } from '@/app/exhibition/_components/editable-url-cell'
import { type ExhibitionTableMeta } from '@/app/exhibition/_components/columns'
import { StatusUpdateCell } from '@/app/exhibition/_components/status-update-cell'
import { DeleteExhibitionModal } from '@/app/exhibition/_components/modal/delete-exhibition-modal'
import { ExcludeExhibitionModal } from '@/app/exhibition/_components/modal/exclude-exhibition-modal'
import { TruncatedText } from '@/components'
import { Button } from '@/components/shadcn-ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn-ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn-ui/tooltip'

interface MuseumExhibitionsTableProps {
  museum: Museum
  exhibitions: Exhibition[]
}

const isPubliclyVisible = (exhibition: Exhibition): boolean => {
  const now = new Date()
  const endDate = new Date(exhibition.endDate)
  return exhibition.status === 'active' && endDate > now
}

const SortButton = ({
  column,
  children,
}: {
  column: Column<Exhibition, unknown>
  children: React.ReactNode
}) => {
  const isSorted = column.getIsSorted()

  return (
    <div className="text-left">
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-8 px-2 lg:px-3"
      >
        {children}
        {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
        {isSorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
        {isSorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  )
}

const museumExhibitionColumns: ColumnDef<Exhibition>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <SortButton column={column}>展覧会</SortButton>,
    cell: ({ row }) => (
      <div className="pl-5 flex items-center gap-2">
        {isPubliclyVisible(row.original) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  公開中
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>ユーザー公開中</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TruncatedText text={row.getValue('title')} maxLength={40} />
      </div>
    ),
  },
  {
    id: 'period',
    accessorFn: (row) => `${row.startDate} - ${row.endDate}`,
    header: ({ column }) => <SortButton column={column}>開催期間</SortButton>,
    cell: ({ row }) => (
      <div className="pl-5 whitespace-nowrap">
        {row.original.startDate} - {row.original.endDate}
      </div>
    ),
    filterFn: 'eventStatusFilter',
  },
  {
    accessorKey: 'officialUrl',
    header: () => <div className="pl-5 text-left">公式サイトURL</div>,
    cell: ({ row }) => <EditableUrlCell exhibition={row.original} />,
  },
  {
    accessorKey: 'genre',
    header: () => <div className="pl-5">ジャンル</div>,
    cell: ({ row }) => <EditableGenreCell exhibition={row.original} />,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortButton column={column}>ステータス</SortButton>,
    cell: ({ row }) => (
      <div className="pl-5">
        <StatusUpdateCell exhibition={row.original} />
      </div>
    ),
    filterFn: 'statusFilter',
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortButton column={column}>更新日</SortButton>,
    cell: ({ row }) => <div className="pl-5 whitespace-nowrap">{row.getValue('updatedAt')}</div>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row, table }) => {
      const exhibition = row.original
      const meta = table.options.meta as ExhibitionTableMeta | undefined

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/exhibition/${exhibition.id}/edit`}>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                編集
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => meta?.onExclude(exhibition)}>
              <Ban className="mr-2 h-4 w-4" />
              除外
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => meta?.onDelete(exhibition)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]

export function MuseumExhibitionsTable({ museum, exhibitions }: MuseumExhibitionsTableProps) {
  const [deletingExhibition, setDeletingExhibition] = useState<Exhibition | undefined>(undefined)
  const [excludingExhibition, setExcludingExhibition] = useState<Exhibition | undefined>(undefined)

  const tableMeta: ExhibitionTableMeta = {
    onDelete: setDeletingExhibition,
    onExclude: setExcludingExhibition,
    museums: [museum],
  }

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>展覧会一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={museumExhibitionColumns}
            data={exhibitions}
            museums={[museum]}
            meta={tableMeta}
            emptyMessage="この美術館に紐づく展覧会はありません。"
            searchFields={[
              { columnId: 'title', placeholder: '展覧会名で検索...' },
              { columnId: 'officialUrl', placeholder: '公式URLで検索...' },
            ]}
            showMuseumFilter={false}
            eventStatusFilterColumnId="period"
          />
        </CardContent>
      </Card>

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
