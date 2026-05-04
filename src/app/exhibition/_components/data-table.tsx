'use client'

import { useState } from 'react'
import {
  Column,
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
import { cn } from '@/utils'

function getPinnedStyles<TData>(column: Column<TData>): React.CSSProperties {
  if (!column.getIsPinned()) return {}
  return {
    left: `${column.getStart('left')}px`,
    position: 'sticky',
    zIndex: 1,
  }
}

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
  emptyMessage?: string
  searchFields?: Array<{
    columnId: string
    placeholder: string
  }>
  showMuseumFilter?: boolean
  showEventStatusFilter?: boolean
  showStatusFilter?: boolean
  eventStatusFilterColumnId?: string
  statusFilterColumnId?: string
  initialColumnVisibility?: Record<string, boolean>
  pinnedLeftColumns?: string[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  museums,
  meta,
  emptyMessage = 'No exhibitions found.',
  searchFields = [
    { columnId: 'title', placeholder: '展覧会名で検索...' },
    { columnId: 'venue', placeholder: '会場で検索...' },
  ],
  showMuseumFilter = true,
  showEventStatusFilter = true,
  showStatusFilter = true,
  eventStatusFilterColumnId = 'startDate',
  statusFilterColumnId = 'status',
  initialColumnVisibility = { museumId: false },
  pinnedLeftColumns = ['title'],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility] = useState<Record<string, boolean>>(initialColumnVisibility)

  // Museum filter state
  const [selectedMuseumIds, setSelectedMuseumIds] = useState<string[]>([])

  // Event status filter state
  const [selectedEventStatuses, setSelectedEventStatuses] = useState<string[]>([])

  // Status filter state (single selection)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Collapsible state for filters
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true)
  const filterSectionCount = [showMuseumFilter, showEventStatusFilter, showStatusFilter].filter(
    Boolean,
  ).length
  const filterGridClass =
    filterSectionCount <= 1
      ? 'md:grid-cols-1'
      : filterSectionCount === 2
        ? 'md:grid-cols-2'
        : 'md:grid-cols-3'

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
      columnVisibility,
      columnPinning: { left: pinnedLeftColumns },
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
        const eventStatus = row.original.eventStatus
        if (!eventStatus) return false
        return filterValue.includes(eventStatus)
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
    table.getColumn(eventStatusFilterColumnId)?.setFilterValue(newSelectedEventStatuses)
  }

  // Update status filter
  const handleStatusFilterChange = (value: string) => {
    setSelectedStatus(value)
    table.getColumn(statusFilterColumnId)?.setFilterValue(value)
  }

  return (
    <div className="space-y-4">
      {/* Search filters */}
      <div className="flex items-center gap-4">
        {searchFields.map((searchField) => (
          <Input
            key={searchField.columnId}
            placeholder={searchField.placeholder}
            value={(table.getColumn(searchField.columnId)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchField.columnId)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        ))}
      </div>

      {/* Advanced filters */}
      {filterSectionCount > 0 && (
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
            <div
              className={cn(
                'grid grid-cols-1 gap-6 rounded-lg border bg-muted/20 p-4',
                filterGridClass,
              )}
            >
              {showMuseumFilter && (
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
              )}

              {showEventStatusFilter && (
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
                      <Label
                        htmlFor="status-ongoing"
                        className="text-sm font-normal cursor-pointer"
                      >
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
                      <Label
                        htmlFor="status-upcoming"
                        className="text-sm font-normal cursor-pointer"
                      >
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
              )}

              {showStatusFilter && (
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
                      <Label
                        htmlFor="status-pending"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Pending
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Table */}

      {/* Total count */}
      <div className="text-sm text-muted-foreground">
        全 {table.getFilteredRowModel().rows.length} 件を表示
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-center px-4',
                      header.column.getIsPinned() && 'bg-background',
                    )}
                    style={getPinnedStyles(header.column)}
                  >
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
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.getIsPinned() && 'bg-background')}
                      style={getPinnedStyles(cell.column)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
