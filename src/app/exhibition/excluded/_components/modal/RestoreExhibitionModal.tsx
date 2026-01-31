'use client'

import type { Exhibition } from '@/schema/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn-ui/dialog'
import { Button } from '@/components/shadcn-ui/button'
import { restoreExhibition } from '@/lib/actions/exhibition'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface RestoreExhibitionModalProps {
  exhibition: Exhibition | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RestoreExhibitionModal({
  exhibition,
  open,
  onOpenChange,
}: RestoreExhibitionModalProps) {
  const [, formAction, isPending] = useActionState(async (_prev: null, formData: FormData) => {
    const id = formData.get('id') as string

    await restoreExhibition(id)

    toast.success('展覧会の除外を解除しました')
    onOpenChange(false)

    return null
  }, null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">除外解除</DialogTitle>
          <DialogDescription>
            この展覧会を除外リストから削除して、通常の一覧に戻します。よろしいですか？
          </DialogDescription>
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
            <Button variant="default" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  解除中...
                </>
              ) : (
                '除外解除'
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
