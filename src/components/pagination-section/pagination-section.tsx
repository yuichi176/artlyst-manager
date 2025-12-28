'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/shadcn-ui/pagination'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type Props = {
  pageSize: number
  totalCount: number
  currentPage: number
}

export function PaginationSection({ pageSize, totalCount, currentPage }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPageCount = Math.max(1, Math.ceil(totalCount / pageSize))

  const buildLink = (page: number) => {
    const params = new URLSearchParams(searchParams ?? undefined)
    params.set('page', String(page))
    return `${pathname}?${params.toString()}`
  }

  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    const maxVisible = 5
    const half = Math.floor(maxVisible / 2)

    let start = Math.max(1, currentPage - half)
    const end = Math.min(totalPageCount, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let p = start; p <= end; p++) {
      pages.push(p)
    }

    return pages
  }, [currentPage, totalPageCount])

  if (totalPageCount <= 1) return null

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildLink(Math.max(currentPage - 1, 1))}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>

        {pageNumbers[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={buildLink(1)} isActive={currentPage === 1}>
                1
              </PaginationLink>
            </PaginationItem>
            {pageNumbers[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={buildLink(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPageCount && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPageCount - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href={buildLink(totalPageCount)}
                isActive={currentPage === totalPageCount}
              >
                {totalPageCount}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href={buildLink(Math.min(currentPage + 1, totalPageCount))}
            aria-disabled={currentPage === totalPageCount}
            tabIndex={currentPage === totalPageCount ? -1 : undefined}
            className={
              currentPage === totalPageCount ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
