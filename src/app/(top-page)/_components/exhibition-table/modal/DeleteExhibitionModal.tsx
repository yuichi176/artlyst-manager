'use client'

import type { Exhibition } from '@/types/exhibition'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteExhibitionModalProps {
  exhibition: Exhibition | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteExhibitionModal({
  exhibition,
  open,
  onOpenChange,
}: DeleteExhibitionModalProps) {
  const handleDelete = () => {
    console.log('Delete confirmed (UI only):', exhibition?.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">展覧会削除</DialogTitle>
          <DialogDescription>この操作は元に戻せません。削除してよろしいですか？</DialogDescription>
        </DialogHeader>
        {exhibition && (
          <div>
            <div className="rounded-md bg-muted p-4">
              <h3 className="font-semibold">{exhibition.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{exhibition.venue}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(exhibition.startDate).toLocaleDateString()} -{' '}
                {new Date(exhibition.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
