import Link from 'next/link'
import { Button } from '@/components/shadcn-ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">展覧会が見つかりません</h2>
      <p className="mb-6 text-muted-foreground">
        指定された展覧会は存在しないか、削除された可能性があります。
      </p>
      <Link href="/">
        <Button>ホームに戻る</Button>
      </Link>
    </div>
  )
}
