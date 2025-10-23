'use client'

import type { Exhibition } from '@/schema/exhibition'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteExhibition } from '@/lib/actions/exhibition'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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
  const [, formAction, isPending] = useActionState(async (_prev: null, formData: FormData) => {
    const id = formData.get('id') as string

    await deleteExhibition(id)

    toast.success('展覧会を削除しました')
    onOpenChange(false)

    return null
  }, null)

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

          <form action={formAction}>
            <input type="hidden" name="id" value={exhibition?.id ?? ''} />
            <Button variant="destructive" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                '削除'
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
