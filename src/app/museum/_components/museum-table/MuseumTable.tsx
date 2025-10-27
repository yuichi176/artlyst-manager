'use client'

import { useState } from 'react'
import type { Museum } from '@/schema/museum'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Pencil, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface MuseumTableProps {
  museums: Museum[]
}

type SortField = 'name'
type SortOrder = 'asc' | 'desc' | null

export function MuseumTable({ museums }: MuseumTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const truncateText = (text: string, maxLength: number = 35) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
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

  const sortedMuseums = [...museums].sort((a, b) => {
    if (!sortField || !sortOrder) return 0

    let comparison = 0

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('name')}
                className="h-8 px-2 lg:px-3"
              >
                美術館名
                {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>住所</TableHead>
            <TableHead>アクセス</TableHead>
            <TableHead>開館情報</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMuseums.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                美術館が見つかりませんでした。
              </TableCell>
            </TableRow>
          ) : (
            sortedMuseums.map((museum) => (
              <TableRow key={museum.id}>
                <TableCell className="pl-5">
                  {museum.officialUrl ? (
                    <a
                      href={museum.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {museum.name}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    museum.name
                  )}
                </TableCell>
                <TableCell>
                  {museum.address.length > 35 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default">{truncateText(museum.address)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-md">{museum.address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    museum.address
                  )}
                </TableCell>
                <TableCell>
                  {museum.access.length > 35 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default">{truncateText(museum.access)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-md">{museum.access}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    museum.access
                  )}
                </TableCell>
                <TableCell>
                  {museum.openingInformation.length > 35 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default">
                            {truncateText(museum.openingInformation)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-md">{museum.openingInformation}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    museum.openingInformation
                  )}
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
                      <Link href={`/museum/${museum.id}/edit`}>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          編集
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
