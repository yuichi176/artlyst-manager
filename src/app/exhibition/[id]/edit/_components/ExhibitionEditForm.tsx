'use client'

import { useActionState } from 'react'
import type { Exhibition } from '@/types/exhibition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateExhibition } from '@/lib/actions/exhibition'
import { Loader2, Calendar, MapPin, FileText, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

interface ExhibitionEditFormProps {
  exhibition: Exhibition
}

export function ExhibitionEditForm({ exhibition }: ExhibitionEditFormProps) {
  const router = useRouter()

  const [, formAction, isPending] = useActionState(async (_prev: null, formData: FormData) => {
    await updateExhibition(exhibition.id, {
      title: formData.get('title') as string,
      venue: formData.get('venue') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      status: formData.get('status') as 'pending' | 'active',
    })

    return null
  }, null)

  return (
    <form action={formAction} className="space-y-6">
      <Card className="py-0 gap-8">
        <CardHeader className="border-b bg-muted/50 px-6 py-6 gap-0">
          <CardTitle className="text-lg font-semibold">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="flex items-center text-sm font-medium">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              展覧会名
              <span className="ml-1 text-destructive">*</span>
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={exhibition.title}
              placeholder="展覧会名を入力してください"
              required
              className="text-base"
            />
          </div>

          {/* Venue */}
          <div className="space-y-2">
            <label htmlFor="venue" className="flex items-center text-sm font-medium">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              会場
              <span className="ml-1 text-destructive">*</span>
            </label>
            <Input
              id="venue"
              name="venue"
              defaultValue={exhibition.venue}
              placeholder="会場名を入力してください"
              required
              className="text-base"
            />
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              開催期間
              <span className="ml-1 text-destructive">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm text-muted-foreground">
                  開始日
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={exhibition.startDate}
                  required
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm text-muted-foreground">
                  終了日
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  defaultValue={exhibition.endDate}
                  required
                  className="text-base"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="flex items-center text-sm font-medium">
              <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
              ステータス
              <span className="ml-1 text-destructive">*</span>
            </label>
            <div className="flex items-center gap-3">
              <Select name="status" defaultValue={exhibition.status}>
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 py-5 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/exhibition')}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto min-w-[120px]">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                変更を保存
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
