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
  Pencil,
  ExternalLink,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { DeleteMuseumModal } from '@/app/museum/_components/museum-table/modal/DeleteMuseumModal'
import { useTableSort } from '@/hooks/useTableSort'
import { TruncatedText } from '@/components'

type SortField = 'name'

interface MuseumTableProps {
  museums: Museum[]
}

export function MuseumTable({ museums }: MuseumTableProps) {
  const [deletingMuseum, setDeletingMuseum] = useState<Museum | undefined>(undefined)

  const {
    sortedItems: sortedMuseums,
    handleSort,
    sortField,
    sortOrder,
  } = useTableSort<Museum, SortField>(museums)

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
              <TableHead>スクレイピング</TableHead>
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
                    <TruncatedText text={museum.address} maxLength={35} />
                  </TableCell>
                  <TableCell>
                    <TruncatedText text={museum.access} maxLength={35} />
                  </TableCell>
                  <TableCell>
                    <TruncatedText text={museum.openingInformation} maxLength={35} />
                  </TableCell>
                  <TableCell className="text-center">{museum.scrapeEnabled ? '⚪︎' : '×'}</TableCell>
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
                        <DropdownMenuItem
                          onClick={() => setDeletingMuseum(museum)}
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

      <DeleteMuseumModal
        museum={deletingMuseum}
        open={deletingMuseum !== undefined}
        onOpenChange={(open) => {
          if (!open) setDeletingMuseum(undefined)
        }}
      />
    </>
  )
}
