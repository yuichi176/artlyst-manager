'use client'

import { useActionState, useRef } from 'react'
import type { Exhibition } from '@/schema/ui'
import { FormSubmitState } from '@/schema/ui'
import { updateExhibitionStatus } from '@/lib/actions/exhibition'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select'

interface StatusUpdateCellProps {
  exhibition: Exhibition
}

export function StatusUpdateCell({ exhibition }: StatusUpdateCellProps) {
  const formRef = useRef<HTMLFormElement | null>(null)

  const [, updateStatus] = useActionState<FormSubmitState, FormData>(updateExhibitionStatus, {
    status: 'pending',
    errors: undefined,
  })

  return (
    <form
      action={updateStatus}
      className="flex items-center"
      ref={formRef}
    >
      <input type="hidden" name="id" value={exhibition.id} />
      <Select
        name="status"
        defaultValue={exhibition.status}
        onValueChange={() => {
          formRef.current?.requestSubmit()
        }}
      >
        <SelectTrigger className="min-w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
    </form>
  )
}
