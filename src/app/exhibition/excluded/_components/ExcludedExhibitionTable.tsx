'use client'

import { useState } from 'react'
import type { Exhibition } from '@/schema/ui'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu'
import { Button } from '@/components/shadcn-ui/button'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Trash2,
  RotateCcw,
} from 'lucide-react'
import { DeleteExhibitionModal } from '@/app/exhibition/_components/exhibition-table/modal/DeleteExhibitionModal'
import { RestoreExhibitionModal } from './modal/RestoreExhibitionModal'
import { useTableSort } from '@/hooks/useTableSort'
import { TruncatedText } from '@/components'

type SortField = 'title' | 'venue' | 'startDate' | 'endDate' | 'status' | 'updatedAt' | 'createdAt'

interface ExcludedExhibitionTableProps {
  exhibitions: Exhibition[]
}

export function ExcludedExhibitionTable({ exhibitions }: ExcludedExhibitionTableProps) {
  const [deletingExhibition, setDeletingExhibition] = useState<Exhibition | undefined>(undefined)
  const [restoringExhibition, setRestoringExhibition] = useState<Exhibition | undefined>(undefined)

  const {
    sortedItems: sortedExhibitions,
    handleSort,
    sortField,
    sortOrder,
  } = useTableSort<Exhibition, SortField>(exhibitions)

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    if (sortOrder === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />
    }
    if (sortOrder === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4" />
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('title')}
                className="h-8 px-2 lg:px-3"
              >
                展覧会
                {getSortIcon('title')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('venue')}
                className="h-8 px-2 lg:px-3"
              >
                会場
                {getSortIcon('venue')}
              </Button>
            </TableHead>
            <TableHead className="pl-5">公式サイトURL</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('startDate')}
                className="h-8 px-2 lg:px-3"
              >
                開始日
                {getSortIcon('startDate')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('endDate')}
                className="h-8 px-2 lg:px-3"
              >
                終了日
                {getSortIcon('endDate')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('status')}
                className="h-8 px-2 lg:px-3"
              >
                ステータス
                {getSortIcon('status')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('updatedAt')}
                className="h-8 px-2 lg:px-3"
              >
                更新日
                {getSortIcon('updatedAt')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('createdAt')}
                className="h-8 px-2 lg:px-3"
              >
                作成日
                {getSortIcon('createdAt')}
              </Button>
            </TableHead>
            <TableHead className="text-center">Origin</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedExhibitions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                除外された展覧会はありません。
              </TableCell>
            </TableRow>
          ) : (
            sortedExhibitions.map((exhibition) => {
              return (
                <TableRow key={exhibition.id}>
                  <TableCell className="pl-5">
                    <TruncatedText text={exhibition.title} maxLength={40} />
                  </TableCell>
                  <TableCell className="pl-5">{exhibition.venue}</TableCell>
                  <TableCell className="pl-5">
                    {exhibition.officialUrl ? (
                      <a
                        href={exhibition.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {exhibition.officialUrl}
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="pl-5">{exhibition.startDate}</TableCell>
                  <TableCell className="pl-5">{exhibition.endDate}</TableCell>
                  <TableCell className="pl-5">{exhibition.status}</TableCell>
                  <TableCell className="pl-5">{exhibition.updatedAt}</TableCell>
                  <TableCell className="pl-5">{exhibition.createdAt}</TableCell>
                  <TableCell className="pl-5">{exhibition.origin ?? '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setRestoringExhibition(exhibition)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          除外解除
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingExhibition(exhibition)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <DeleteExhibitionModal
        exhibition={deletingExhibition}
        open={deletingExhibition !== undefined}
        onOpenChange={(open) => {
          if (!open) setDeletingExhibition(undefined)
        }}
      />

      <RestoreExhibitionModal
        exhibition={restoringExhibition}
        open={restoringExhibition !== undefined}
        onOpenChange={(open) => {
          if (!open) setRestoringExhibition(undefined)
        }}
      />
    </>
  )
}
