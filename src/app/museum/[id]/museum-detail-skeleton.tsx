import { Skeleton } from '@/components/shadcn-ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/shadcn-ui/card'

export default function MuseumDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-72" />
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
