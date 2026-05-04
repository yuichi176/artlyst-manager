import Link from 'next/link'
import { ExternalLink, Pencil } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Museum } from '@/schema/ui'
import { Badge } from '@/components/shadcn-ui/badge'
import { Button } from '@/components/shadcn-ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card'

interface MuseumInfoCardProps {
  museum: Museum
  exhibitionCount: number
}

interface MuseumInfoItemProps {
  label: string
  value?: ReactNode
  className?: string
}

function MuseumInfoItem({ label, value, className }: MuseumInfoItemProps) {
  const hasValue = value !== undefined && value !== null && value !== ''

  return (
    <div className={className}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-2 whitespace-pre-line break-words text-sm leading-6">
        {hasValue ? value : '未設定'}
      </dd>
    </div>
  )
}

export function MuseumInfoCard({ museum, exhibitionCount }: MuseumInfoCardProps) {
  const scrapeSummary = museum.scrape.enabled
    ? `有効 / URL ${museum.scrape.scrapeUrls.length} 件${
        museum.scrape.lastScrapedAt ? ` / 最終実行 ${museum.scrape.lastScrapedAt}` : ''
      }`
    : '無効'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{museum.venueType}</Badge>
            <Badge variant="outline">{museum.area}</Badge>
            <Badge variant="outline">{museum.region}</Badge>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">{museum.name}</CardTitle>
            <CardDescription>紐づく展覧会 {exhibitionCount} 件</CardDescription>
          </div>
        </div>
        <CardAction>
          <Button asChild variant="outline" size="sm">
            <Link href={`/museum/${museum.id}/edit`}>
              <Pencil className="h-4 w-4" />
              編集
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <dl className="space-y-6">
          <MuseumInfoItem label="住所" value={museum.address} />
          <MuseumInfoItem label="アクセス" value={museum.access} />
          <MuseumInfoItem label="開館情報" value={museum.openingInformation} />
          <MuseumInfoItem
            label="公式サイト"
            value={
              museum.officialUrl ? (
                <a
                  href={museum.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {museum.officialUrl}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : undefined
            }
          />
        </dl>

        <dl className="space-y-6">
          <MuseumInfoItem
            label="別名"
            value={museum.aliases.length > 0 ? museum.aliases.join('\n') : undefined}
          />
          <MuseumInfoItem label="スクレイピング" value={scrapeSummary} />
          <MuseumInfoItem label="更新日" value={museum.updatedAt} />
          <MuseumInfoItem label="作成日" value={museum.createdAt} />
        </dl>
      </CardContent>
    </Card>
  )
}
