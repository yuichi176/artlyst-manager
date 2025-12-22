import { useState, useMemo } from 'react'

export type SortOrder = 'asc' | 'desc' | null

export function useTableSort<T, K extends keyof T>(items: T[]) {
  const [sortField, setSortField] = useState<K | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const handleSort = (field: K) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else if (sortOrder === 'desc') {
        setSortOrder(null)
        setSortField(null)
      } else {
        setSortOrder('asc')
      }
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedItems = useMemo(() => {
    if (!sortField || !sortOrder) return items

    return [...items].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder === 'asc' ? comparison : -comparison
      }

      return 0
    })
  }, [items, sortField, sortOrder])

  return {
    sortedItems,
    sortField,
    sortOrder,
    handleSort,
  }
}
