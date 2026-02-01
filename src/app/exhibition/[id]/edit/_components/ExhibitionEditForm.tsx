'use client'

import { useActionState, useEffect, useState } from 'react'
import { Exhibition, Museum } from '@/schema/ui'
import { Button } from '@/components/shadcn-ui/button'
import { Input } from '@/components/shadcn-ui/input'
import { updateExhibition } from '@/lib/actions/exhibition'
import {
  Loader2,
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  Link as LinkIcon,
  Image,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/shadcn-ui/card'
import { toast } from 'sonner'
import { FormSubmitState } from '@/schema/ui'

interface ExhibitionEditFormProps {
  exhibition: Exhibition
  museums: Museum[]
}

export function ExhibitionEditForm({ exhibition, museums }: ExhibitionEditFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(exhibition.imageUrl || '')
  const [imageError, setImageError] = useState(false)

  const [formState, update, isPending] = useActionState<FormSubmitState, FormData>(
    updateExhibition,
    {
      status: 'pending',
      errors: undefined,
    },
  )

  useEffect(() => {
    if (formState && formState.status === 'success') {
      toast.success('展覧会情報を更新しました')
      router.push('/exhibition')
    }
  }, [formState, router])

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageError(false)
  }

  return (
    <form action={update} className="space-y-6">
      <Card className="py-0 gap-8">
        <CardHeader className="border-b bg-muted/50 px-6 py-6 gap-0">
          <CardTitle className="text-lg font-semibold">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.title}
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              会場
            </label>
            <div className="rounded-md border border-input bg-muted px-3 py-2 text-base">
              {exhibition.venue}
            </div>
            <p className="text-sm text-muted-foreground">会場は作成後に変更できません</p>
          </div>

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
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.startDate || formState?.errors?.endDate}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="officialUrl" className="flex items-center text-sm font-medium">
              <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              公式サイトURL
            </label>
            <Input
              id="officialUrl"
              name="officialUrl"
              type="url"
              defaultValue={exhibition.officialUrl}
              placeholder="https://example.com"
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.officialUrl}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="flex items-center text-sm font-medium">
              <Image className="mr-2 h-4 w-4 text-muted-foreground" />
              画像URL
            </label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.imageUrl}
            </p>
            {imageUrl && (
              <div className="mt-4 rounded-md border p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">プレビュー:</p>
                {!imageError ? (
                  <img
                    src={imageUrl}
                    alt="画像プレビュー"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    className="max-w-full h-auto max-h-[300px] rounded-md object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[200px] bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">画像を読み込めません</p>
                  </div>
                )}
              </div>
            )}
          </div>

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

          <input type="hidden" name="id" value={exhibition.id} />
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
