'use client'

import { useState } from 'react'
import type { Exhibition } from '@/types/exhibition'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { EditExhibitionModal } from '@/app/(top-page)/_components/exhibition-table/modal/EditExhibitionModal'
import { DeleteExhibitionModal } from '@/app/(top-page)/_components/exhibition-table/modal/DeleteExhibitionModal'

interface ExhibitionTableProps {
  exhibitions: Exhibition[]
}

type SortField = 'title' | 'venue' | 'startDate' | 'endDate' | 'status'
type SortOrder = 'asc' | 'desc' | null

export function ExhibitionTable({ exhibitions }: ExhibitionTableProps) {
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | undefined>(undefined)
  const [deletingExhibition, setDeletingExhibition] = useState<Exhibition | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all')
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title
    return title.slice(0, maxLength) + '...'
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else if (sortOrder === 'desc') {
        setSortOrder(null)
        setSortField(null)
      }
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

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

  const filteredExhibitions = exhibitions.filter((exhibition) => {
    if (statusFilter === 'all') return true
    return exhibition.status === statusFilter
  })

  const sortedExhibitions = [...filteredExhibitions].sort((a, b) => {
    if (!sortField || !sortOrder) return 0

    let comparison = 0

    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'venue':
        comparison = a.venue.localeCompare(b.venue)
        break
      case 'startDate':
        comparison = a.startDate.localeCompare(b.startDate)
        break
      case 'endDate':
        comparison = a.endDate.localeCompare(b.endDate)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return (
    <>
      <div className="mb-4 flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
          size="sm"
        >
          すべて
        </Button>
        <Button
          variant={statusFilter === 'active' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('active')}
          size="sm"
        >
          Active
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('pending')}
          size="sm"
        >
          Pending
        </Button>
      </div>

      <div className="rounded-md border">
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
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExhibitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No exhibitions found.
                </TableCell>
              </TableRow>
            ) : (
              sortedExhibitions.map((exhibition) => (
                <TableRow key={exhibition.id}>
                  <TableCell className="pl-5">
                    {exhibition.title.length > 40 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">
                              {truncateTitle(exhibition.title)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-md">{exhibition.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      exhibition.title
                    )}
                  </TableCell>
                  <TableCell className="pl-5">{exhibition.venue}</TableCell>
                  <TableCell className="pl-5">{exhibition.startDate}</TableCell>
                  <TableCell className="pl-5">{exhibition.endDate}</TableCell>
                  <TableCell className="pl-5">
                    <Badge variant={exhibition.status === 'active' ? 'default' : 'secondary'}>
                      {exhibition.status === 'active' ? 'Active' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingExhibition(exhibition)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          編集
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditExhibitionModal
        exhibition={editingExhibition}
        open={editingExhibition !== undefined}
        onOpenChange={(open) => {
          if (!open) setEditingExhibition(undefined)
        }}
      />

      <DeleteExhibitionModal
        exhibition={deletingExhibition}
        open={deletingExhibition !== undefined}
        onOpenChange={(open) => {
          if (!open) setDeletingExhibition(undefined)
        }}
      />
    </>
  )
}
