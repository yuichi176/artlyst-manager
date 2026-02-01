'use client'

import { ColumnDef, Column } from '@tanstack/react-table'
import type { Exhibition } from '@/schema/ui'
import { Button } from '@/components/shadcn-ui/button'
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
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Ban,
} from 'lucide-react'
import Link from 'next/link'
import { TruncatedText } from '@/components'
import { StatusUpdateCell } from './status-update-cell'

// Type for table meta to pass callbacks
export interface ExhibitionTableMeta {
  onDelete: (exhibition: Exhibition) => void
  onExclude: (exhibition: Exhibition) => void
}

// Helper to check if exhibition is publicly visible
const isPubliclyVisible = (exhibition: Exhibition): boolean => {
  const now = new Date()
  const endDate = new Date(exhibition.endDate)
  return exhibition.status === 'active' && endDate > now
}

// Helper to render sort icon
const SortButton = ({
  column,
  children,
}: {
  column: Column<Exhibition, unknown>
  children: React.ReactNode
}) => {
  const isSorted = column.getIsSorted()

  return (
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
  )
}

export const columns: ColumnDef<Exhibition>[] = [
  {
    accessorKey: 'museumId',
    header: '',
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
    filterFn: 'museumFilter',
  },
  {
    id: 'visibility',
    header: '',
    cell: ({ row }) => {
      const exhibition = row.original
      if (!isPubliclyVisible(exhibition)) {
        return null
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Eye className="h-4 w-4 text-green-600 mx-auto" />
            </TooltipTrigger>
            <TooltipContent>
              <p>ユーザー公開中</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortButton column={column}>展覧会</SortButton>,
    cell: ({ row }) => (
      <div className="pl-5">
        <TruncatedText text={row.getValue('title')} maxLength={40} />
      </div>
    ),
  },
  {
    accessorKey: 'venue',
    header: ({ column }) => <SortButton column={column}>会場</SortButton>,
    cell: ({ row }) => <div className="pl-5">{row.getValue('venue')}</div>,
  },
  {
    accessorKey: 'officialUrl',
    header: () => <div className="pl-5">公式サイトURL</div>,
    cell: ({ row }) => {
      const url = row.getValue('officialUrl') as string | undefined

      return (
        <div className="pl-5">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {url}
            </a>
          ) : (
            '-'
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => <SortButton column={column}>開始日</SortButton>,
    cell: ({ row }) => <div className="pl-5">{row.getValue('startDate')}</div>,
    filterFn: 'eventStatusFilter',
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => <SortButton column={column}>終了日</SortButton>,
    cell: ({ row }) => <div className="pl-5">{row.getValue('endDate')}</div>,
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
    cell: ({ row }) => <div className="pl-5">{row.getValue('updatedAt')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortButton column={column}>作成日</SortButton>,
    cell: ({ row }) => <div className="pl-5">{row.getValue('createdAt')}</div>,
  },
  {
    accessorKey: 'origin',
    header: () => <div className="pl-5">Origin</div>,
    cell: ({ row }) => {
      const origin = row.getValue('origin') as string | undefined
      return <div className="pl-5">{origin ?? '-'}</div>
    },
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
