'use client'

import { useActionState } from 'react'
import { Button } from '@/components/shadcn-ui/button'
import { Input } from '@/components/shadcn-ui/input'
import { createMuseum } from '@/lib/actions/museum'
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
import { FormSubmitState } from '@/schema/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select'
import { venueTypeOptions, areaOptions } from '@/schema/ui'

export function MuseumCreateForm() {
  const router = useRouter()

  const [formState, create, isPending] = useActionState<FormSubmitState, FormData>(createMuseum, {
    status: 'pending',
    errors: undefined,
  })

  return (
    <form action={create} className="space-y-6">
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
            </label>
            <Input
              id="openingInformation"
              name="openingInformation"
              placeholder="開館情報を入力してください"
              className="text-base"
            />
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.openingInformation}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="venueType" className="flex items-center text-sm font-medium">
              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
              施設タイプ
              <span className="ml-1 text-destructive">*</span>
            </label>
            <div className="flex items-center gap-3">
              <Select name="venueType" defaultValue={venueTypeOptions[0].value} required>
                <SelectTrigger id="venueType" className="min-w-[160px]">
                  <SelectValue placeholder="施設タイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  {venueTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.venueType}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="area" className="flex items-center text-sm font-medium">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              エリア
              <span className="ml-1 text-destructive">*</span>
            </label>
            <div className="flex items-center gap-3">
              <Select name="area" defaultValue={areaOptions[0].value} required>
                <SelectTrigger id="area" className="min-w-[160px]">
                  <SelectValue placeholder="エリアを選択" />
                </SelectTrigger>
                <SelectContent>
                  {areaOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p aria-live="polite" className="text-sm text-destructive">
              {formState?.errors?.area}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="officialUrl" className="flex items-center text-sm font-medium">
              <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              公式サイトURL
              <span className="ml-1 text-destructive">*</span>
            </label>
            <Input
              id="officialUrl"
              name="officialUrl"
              type="url"
              placeholder="https://example.com"
              required
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
              <span className="ml-1 text-destructive">*</span>
            </label>
            <Input
              id="scrapeUrl"
              name="scrapeUrl"
              type="url"
              placeholder="https://example.com/exhibitions"
              required
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
              <Select name="scrapeEnabled" defaultValue="true">
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
                登録中...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                登録
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
