'use client'

import { useState, useTransition } from 'react'
import type { Exhibition } from '@/schema/ui'
import { updateExhibitionOfficialUrl } from '@/lib/actions/exhibition'
import { Input } from '@/components/shadcn-ui/input'
import { Button } from '@/components/shadcn-ui/button'
import { Pencil, Check, X, Loader2 } from 'lucide-react'

interface EditableUrlCellProps {
  exhibition: Exhibition
}

export function EditableUrlCell({ exhibition }: EditableUrlCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [urlValue, setUrlValue] = useState(exhibition.officialUrl || '')
  const [error, setError] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('id', exhibition.id)
        formData.append('officialUrl', urlValue)

        const result = await updateExhibitionOfficialUrl(
          { status: 'pending', errors: undefined },
          formData
        )

        if (result.status === 'success') {
          setIsEditing(false)
          setError(undefined)
        } else if (result.errors?.officialUrl) {
          setError(result.errors.officialUrl)
        }
      } catch (err) {
        setError('更新中にエラーが発生しました')
        console.error('Failed to update URL:', err)
      }
    })
  }

  const handleCancel = () => {
    setUrlValue(exhibition.officialUrl || '')
    setIsEditing(false)
    setError(undefined)
  }

  if (isEditing) {
    return (
      <div className="pl-5">
        <div className="flex items-center gap-2">
          <Input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://example.com"
            className="h-8 text-sm"
            disabled={isPending}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isPending}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isPending}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 pl-5 group">
      {exhibition.officialUrl ? (
        <a
          href={exhibition.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline truncate max-w-xs"
        >
          {exhibition.officialUrl}
        </a>
      ) : (
        <span className="text-muted-foreground">-</span>
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  )
}
