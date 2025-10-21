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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { EditExhibitionModal } from './edit-exhibition-modal'
import { DeleteExhibitionModal } from './delete-exhibition-modal'

interface ExhibitionTableProps {
  exhibitions: Exhibition[]
}

export function ExhibitionTable({ exhibitions }: ExhibitionTableProps) {
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | undefined>(undefined)
  const [deletingExhibition, setDeletingExhibition] = useState<Exhibition | undefined>(undefined)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>展覧会名</TableHead>
              <TableHead>会場</TableHead>
              <TableHead>開始日</TableHead>
              <TableHead>終了日</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exhibitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No exhibitions found.
                </TableCell>
              </TableRow>
            ) : (
              exhibitions.map((exhibition) => (
                <TableRow key={exhibition.id}>
                  <TableCell>{exhibition.title}</TableCell>
                  <TableCell>{exhibition.venue}</TableCell>
                  <TableCell>{exhibition.startDate}</TableCell>
                  <TableCell>{exhibition.endDate}</TableCell>
                  <TableCell>
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
