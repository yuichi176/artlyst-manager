'use client'

import { truncate } from '@/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn-ui/tooltip'

interface TruncatedTextProps {
  text: string
  maxLength?: number
  className?: string
}

export function TruncatedText({ text, maxLength = 40, className }: TruncatedTextProps) {
  if (text.length <= maxLength) {
    return <span className={className}>{text}</span>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-default ${className ?? ''}`}>{truncate(text, maxLength)}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="py-2">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
