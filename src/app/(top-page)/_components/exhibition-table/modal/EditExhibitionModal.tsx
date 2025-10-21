'use client'

import { useEffect, useState } from 'react'
import type { Exhibition } from '@/types/exhibition'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EditExhibitionModalProps {
  exhibition: Exhibition | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditExhibitionModal({ exhibition, open, onOpenChange }: EditExhibitionModalProps) {
  const [formData, setFormData] = useState<Exhibition>({
    id: '',
    title: '',
    venue: '',
    startDate: '',
    endDate: '',
    status: 'pending',
  })

  useEffect(() => {
    if (exhibition) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        id: exhibition.id,
        title: exhibition.title,
        venue: exhibition.venue,
        startDate: exhibition.startDate,
        endDate: exhibition.endDate,
        status: exhibition.status,
      })
    }
  }, [exhibition])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // UI only - no actual data update
    console.log('Edit submitted (UI only):', formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>展覧会編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                展覧会名
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter exhibition name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="venue" className="text-sm font-medium">
                会場
              </label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Enter venue name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  開始日
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  終了日
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                ステータス
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'pending' | 'active',
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
