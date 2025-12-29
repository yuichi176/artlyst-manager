'use client'

import { useActionState, useEffect } from 'react'
import { Museum } from '@/schema/museum'
import { Button } from '@/components/shadcn-ui/button'
import { Input } from '@/components/shadcn-ui/input'
import { updateMuseum } from '@/lib/actions/museum'
import {
  Loader2,
  MapPin,
  Building2,
  Info,
  Clock,
  Link as LinkIcon,
  Globe,
  CheckCircle2,
  ToggleRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/shadcn-ui/card'
import { toast } from 'sonner'
import { FormSubmitState } from '@/schema/common'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select'

interface MuseumEditFormProps {
  museum: Museum
}

export function MuseumEditForm({ museum }: MuseumEditFormProps) {
  const router = useRouter()

  const [formState, update, isPending] = useActionState<FormSubmitState, FormData>(updateMuseum, {
    status: 'pending',
    errors: undefined,
  })

  useEffect(() => {
    if (formState && formState.status === 'success') {
      toast.success('美術館情報を更新しました')
      router.push('/museum')
    }
  }, [formState, router])

  return (
    <form action={update} className="space-y-6">
      <Card className="py-0 gap-8">
        <CardHeader className="border-b bg-muted/50 px-6 py-6 gap-0">
          <CardTitle className="text-lg font-semibold">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center text-sm font-medium">
              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
              美術館名
              <span className="ml-1 text-destructive">*</span>
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={museum.name}
              placeholder="美術館名を入力してください"
              required
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.name}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="flex items-center text-sm font-medium">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              住所
              <span className="ml-1 text-destructive">*</span>
            </label>
            <Input
              id="address"
              name="address"
              defaultValue={museum.address}
              placeholder="住所を入力してください"
              required
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.address}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="access" className="flex items-center text-sm font-medium">
              <Info className="mr-2 h-4 w-4 text-muted-foreground" />
              アクセス
              <span className="ml-1 text-destructive">*</span>
            </label>
            <Input
              id="access"
              name="access"
              defaultValue={museum.access}
              placeholder="アクセス情報を入力してください"
              required
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.access}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="openingInformation" className="flex items-center text-sm font-medium">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              開館情報
              <span className="ml-1 text-destructive">*</span>
            </label>
            <Input
              id="openingInformation"
              name="openingInformation"
              defaultValue={museum.openingInformation}
              placeholder="開館情報を入力してください"
              required
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.openingInformation}
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
              defaultValue={museum.officialUrl}
              placeholder="https://example.com"
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.officialUrl}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="scrapeUrl" className="flex items-center text-sm font-medium">
              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
              スクレイプURL
            </label>
            <Input
              id="scrapeUrl"
              name="scrapeUrl"
              type="url"
              defaultValue={museum.scrapeUrl}
              placeholder="https://example.com/exhibitions"
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.scrapeUrl}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="scrapeEnabled" className="flex items-center text-sm font-medium">
              <ToggleRight className="mr-2 h-4 w-4 text-muted-foreground" />
              スクレイピング
            </label>
            <div className="flex items-center gap-3">
              <Select name="scrapeEnabled" defaultValue={String(museum.scrapeEnabled)}>
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">有効</SelectItem>
                  <SelectItem value="false">無効</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <input type="hidden" name="id" value={museum.id} />
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 py-5 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/museum')}
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
