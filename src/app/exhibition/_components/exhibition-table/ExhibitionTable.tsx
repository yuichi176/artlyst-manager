'use client'

import { useState } from 'react'
import type { Exhibition } from '@/schema/exhibition'
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
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { DeleteExhibitionModal } from '@/app/exhibition/_components/exhibition-table/modal/DeleteExhibitionModal'
import Link from 'next/link'

interface ExhibitionTableProps {
  exhibitions: Exhibition[]
}

type SortField = 'title' | 'venue' | 'startDate' | 'endDate' | 'status'
type SortOrder = 'asc' | 'desc' | null

export function ExhibitionTable({ exhibitions }: ExhibitionTableProps) {
  const [deletingExhibition, setDeletingExhibition] = useState<Exhibition | undefined>(undefined)
  const [publicVisibilityFilter, setPublicVisibilityFilter] = useState<boolean | null>(null)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title
    return title.slice(0, maxLength) + '...'
  }

  const isPubliclyVisible = (exhibition: Exhibition): boolean => {
    const now = new Date()
    const endDate = new Date(exhibition.endDate)
    return exhibition.status === 'active' && endDate > now
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
    // Filter by public visibility
    if (publicVisibilityFilter !== null) {
      const isVisible = isPubliclyVisible(exhibition)
      if (publicVisibilityFilter !== isVisible) {
        return false
      }
    }

    return true
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
          <Eye className="h-4 w-4 mr-1" />
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px]"></TableHead>
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
              <TableHead className="text-center">公式サイトURL</TableHead>
              <TableHead className="text-center">画像URL</TableHead>
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
                <TableCell colSpan={9} className="h-24 text-center">
                  No exhibitions found.
                </TableCell>
              </TableRow>
            ) : (
              sortedExhibitions.map((exhibition) => (
                <TableRow key={exhibition.id}>
                  <TableCell className="text-center">
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
                  <TableCell className="text-center">
                    {exhibition.officialUrl ? '⚪︎' : '×'}
                  </TableCell>
                  <TableCell className="text-center">{exhibition.imageUrl ? '⚪︎' : '×'}</TableCell>
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
                        <Link href={`/exhibition/${exhibition.id}/edit`}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            編集
                          </DropdownMenuItem>
                        </Link>
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
