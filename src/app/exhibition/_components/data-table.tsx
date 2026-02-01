'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  TableMeta,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-ui/table'
import { Input } from '@/components/shadcn-ui/input'
import { Checkbox } from '@/components/shadcn-ui/checkbox'
import { Label } from '@/components/shadcn-ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn-ui/radio-group'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn-ui/collapsible'
import { Button } from '@/components/shadcn-ui/button'
import { ChevronDown } from 'lucide-react'
import type { Museum } from '@/schema/ui'

// Declare module to extend TanStack Table types
declare module '@tanstack/react-table' {
  interface FilterFns {
    museumFilter: FilterFn<unknown>
    eventStatusFilter: FilterFn<unknown>
    statusFilter: FilterFn<unknown>
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  museums: Museum[]
  meta?: TableMeta<TData>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  museums,
  meta,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Museum filter state
  const [selectedMuseumIds, setSelectedMuseumIds] = useState<string[]>([])

  // Event status filter state
  const [selectedEventStatuses, setSelectedEventStatuses] = useState<string[]>([])

  // Status filter state (single selection)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Collapsible state for filters
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    meta,
    filterFns: {
      museumFilter: (row, columnId, filterValue: string[]) => {
        if (!filterValue || filterValue.length === 0) return true
        const museumId = row.getValue(columnId) as string
        return filterValue.includes(museumId)
      },
      eventStatusFilter: (row, columnId, filterValue: string[]) => {
        if (!filterValue || filterValue.length === 0) return true
        const startDate = new Date(row.getValue('startDate') as string)
        const endDate = new Date(row.getValue('endDate') as string)
        const now = new Date()

        const isOngoing = startDate <= now && now <= endDate
        const isUpcoming = now < startDate
        const isEnded = endDate < now

        return (
          (filterValue.includes('ongoing') && isOngoing) ||
          (filterValue.includes('upcoming') && isUpcoming) ||
          (filterValue.includes('ended') && isEnded)
        )
      },
      statusFilter: (row, columnId, filterValue: string) => {
        if (!filterValue || filterValue === 'all') return true
        return row.getValue(columnId) === filterValue
      },
    },
  })

  // Update museum filter
  const handleMuseumFilterChange = (museumId: string, checked: boolean) => {
    const newSelectedMuseumIds = checked
      ? [...selectedMuseumIds, museumId]
      : selectedMuseumIds.filter((id) => id !== museumId)

    setSelectedMuseumIds(newSelectedMuseumIds)
    table.getColumn('museumId')?.setFilterValue(newSelectedMuseumIds)
  }

  // Update event status filter
  const handleEventStatusFilterChange = (status: string, checked: boolean) => {
    const newSelectedEventStatuses = checked
      ? [...selectedEventStatuses, status]
      : selectedEventStatuses.filter((s) => s !== status)

    setSelectedEventStatuses(newSelectedEventStatuses)
    table.getColumn('startDate')?.setFilterValue(newSelectedEventStatuses)
  }

  // Update status filter
  const handleStatusFilterChange = (value: string) => {
    setSelectedStatus(value)
    table.getColumn('status')?.setFilterValue(value)
  }

  return (
    <div className="space-y-4">
      {/* Search filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="展覧会名で検索..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="会場で検索..."
          value={(table.getColumn('venue')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('venue')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Advanced filters */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">詳細フィルター</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isFilterOpen ? 'transform rotate-180' : ''
                }`}
              />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg bg-muted/20">
            {/* Museum filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">会場名</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {museums.map((museum) => (
                  <div key={museum.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`museum-${museum.id}`}
                      checked={selectedMuseumIds.includes(museum.id)}
                      onCheckedChange={(checked) =>
                        handleMuseumFilterChange(museum.id, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`museum-${museum.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {museum.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Event status filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">開催ステータス</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-ongoing"
                    checked={selectedEventStatuses.includes('ongoing')}
                    onCheckedChange={(checked) =>
                      handleEventStatusFilterChange('ongoing', checked === true)
                    }
                  />
                  <Label htmlFor="status-ongoing" className="text-sm font-normal cursor-pointer">
                    開催中
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-upcoming"
                    checked={selectedEventStatuses.includes('upcoming')}
                    onCheckedChange={(checked) =>
                      handleEventStatusFilterChange('upcoming', checked === true)
                    }
                  />
                  <Label htmlFor="status-upcoming" className="text-sm font-normal cursor-pointer">
                    開催前
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-ended"
                    checked={selectedEventStatuses.includes('ended')}
                    onCheckedChange={(checked) =>
                      handleEventStatusFilterChange('ended', checked === true)
                    }
                  />
                  <Label htmlFor="status-ended" className="text-sm font-normal cursor-pointer">
                    終了
                  </Label>
                </div>
              </div>
            </div>

            {/* Status filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">ステータス</h3>
              <RadioGroup value={selectedStatus} onValueChange={handleStatusFilterChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="status-all" />
                  <Label htmlFor="status-all" className="text-sm font-normal cursor-pointer">
                    すべて
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="status-active" />
                  <Label htmlFor="status-active" className="text-sm font-normal cursor-pointer">
                    Active
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="status-pending" />
                  <Label htmlFor="status-pending" className="text-sm font-normal cursor-pointer">
                    Pending
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Table */}

      {/* Total count */}
      <div className="text-sm text-muted-foreground">
        全 {table.getFilteredRowModel().rows.length} 件を表示
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No exhibitions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
