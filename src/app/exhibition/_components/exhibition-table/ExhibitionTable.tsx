'use client'

import { useActionState, useMemo, useRef, useState } from 'react'
import type { Exhibition } from '@/schema/exhibition'
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
import { DeleteExhibitionModal } from '@/app/exhibition/_components/exhibition-table/modal/DeleteExhibitionModal'
import { ExcludeExhibitionModal } from '@/app/exhibition/_components/exhibition-table/modal/ExcludeExhibitionModal'
import Link from 'next/link'
import { useTableSort } from '@/hooks/useTableSort'
import { TruncatedText } from '@/components'
import { FormSubmitState } from '@/schema/common'
import { updateExhibitionStatus } from '@/lib/actions/exhibition'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select'

type SortField = 'title' | 'venue' | 'startDate' | 'endDate' | 'status' | 'updatedAt' | 'createdAt'

interface ExhibitionTableProps {
  exhibitions: Exhibition[]
}

export function ExhibitionTable({ exhibitions }: ExhibitionTableProps) {
  const [deletingExhibition, setDeletingExhibition] = useState<Exhibition | undefined>(undefined)
  const [excludingExhibition, setExcludingExhibition] = useState<Exhibition | undefined>(undefined)
  const [publicVisibilityFilter, setPublicVisibilityFilter] = useState<boolean | null>(null)

  const formRefs = useRef<Record<string, HTMLFormElement | null>>({})

  const [, updateStatus] = useActionState<FormSubmitState, FormData>(updateExhibitionStatus, {
    status: 'pending',
    errors: undefined,
  })

  const {
    sortedItems: sortedExhibitions,
    handleSort,
    sortField,
    sortOrder,
  } = useTableSort<Exhibition, SortField>(exhibitions)

  const isPubliclyVisible = (exhibition: Exhibition): boolean => {
    const now = new Date()
    const endDate = new Date(exhibition.endDate)
    return exhibition.status === 'active' && endDate > now
  }

  const filteredExhibitions = useMemo(() => {
    return sortedExhibitions.filter((exhibition) => {
      if (publicVisibilityFilter !== null) {
        const isVisible = isPubliclyVisible(exhibition)
        if (publicVisibilityFilter !== isVisible) {
          return false
        }
      }
      return true
    })
  }, [sortedExhibitions, publicVisibilityFilter])

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
      <div className="mb-4 flex gap-2">
        <Button
          variant={publicVisibilityFilter === null ? 'default' : 'outline'}
          onClick={() => setPublicVisibilityFilter(null)}
          size="sm"
        >
          すべて
        </Button>
        <Button
          variant={publicVisibilityFilter === true ? 'default' : 'outline'}
          onClick={() => setPublicVisibilityFilter(true)}
          size="sm"
        >
          <Eye className="h-4 w-4" />
          公開中
        </Button>
        <Button
          variant={publicVisibilityFilter === false ? 'default' : 'outline'}
          onClick={() => setPublicVisibilityFilter(false)}
          size="sm"
        >
          非公開
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center px-4"></TableHead>
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
            {/*<TableHead className="text-center">画像URL</TableHead>*/}
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
          {filteredExhibitions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No exhibitions found.
              </TableCell>
            </TableRow>
          ) : (
            filteredExhibitions.map((exhibition) => {
              return (
                <TableRow key={exhibition.id}>
                  <TableCell className="text-center px-4">
                    {isPubliclyVisible(exhibition) && (
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
                    )}
                  </TableCell>
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
                  {/*<TableCell className="text-center">{exhibition.imageUrl ? '⚪︎' : '×'}</TableCell>*/}
                  <TableCell className="pl-5">
                    <form
                      action={updateStatus}
                      className="flex items-center"
                      ref={(el) => {
                        formRefs.current[exhibition.id] = el
                      }}
                    >
                      <input type="hidden" name="id" value={exhibition.id} />
                      <Select
                        name="status"
                        defaultValue={exhibition.status}
                        onValueChange={() => {
                          formRefs.current[exhibition.id]?.requestSubmit()
                        }}
                      >
                        <SelectTrigger className="min-w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </form>
                  </TableCell>
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
                        <Link href={`/exhibition/${exhibition.id}/edit`}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            編集
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => setExcludingExhibition(exhibition)}>
                          <Ban className="mr-2 h-4 w-4" />
                          除外
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
