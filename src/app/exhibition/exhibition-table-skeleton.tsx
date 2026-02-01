import { Skeleton } from '@/components/shadcn-ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-ui/table'

export default function ExhibitionTableSkeleton() {
  return (
    <>
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-8 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-8 w-16" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-8 w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-8 w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-8 w-24" />
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-full max-w-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
