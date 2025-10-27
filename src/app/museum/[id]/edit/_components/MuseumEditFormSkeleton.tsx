import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export function MuseumEditFormSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Access Field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Opening Information Field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Official URL Field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Scrape URL Field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sticky bottom-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-lg">
        <Skeleton className="h-10 w-full sm:w-24" />
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>
    </div>
  )
}
