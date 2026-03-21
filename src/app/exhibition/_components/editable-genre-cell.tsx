'use client'

import { useState, useTransition } from 'react'
import type { Exhibition } from '@/schema/ui'
import { genres } from '@/schema/common/exhibition'
import type { Genre } from '@/schema/common/exhibition'
import { updateExhibitionGenre } from '@/lib/actions/exhibition'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu'
import { Button } from '@/components/shadcn-ui/button'
import { Pencil, Loader2 } from 'lucide-react'

interface EditableGenreCellProps {
  exhibition: Exhibition
}

export function EditableGenreCell({ exhibition }: EditableGenreCellProps) {
  const [selected, setSelected] = useState<Genre[]>((exhibition.genre ?? []) as Genre[])
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleCheckedChange = (genre: Genre, checked: boolean) => {
    const next = checked ? [...selected, genre] : selected.filter((g) => g !== genre)
    setSelected(next)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', exhibition.id)
      next.forEach((g) => formData.append('genre', g))
      await updateExhibitionGenre({ status: 'pending', errors: undefined }, formData)
    })
  }

  return (
    <div className="pl-5 flex items-center gap-1 group">
      <div className="flex flex-wrap gap-1">
        {selected.length > 0 ? (
          selected.map((g) => (
            <span key={g} className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {g}
            </span>
          ))
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Pencil className="h-3 w-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
          {genres.map((genre) => (
            <DropdownMenuCheckboxItem
              key={genre}
              checked={selected.includes(genre)}
              onCheckedChange={(checked) => handleCheckedChange(genre, checked)}
              onSelect={(e) => e.preventDefault()}
            >
              {genre}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
