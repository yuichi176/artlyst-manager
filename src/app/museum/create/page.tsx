import { Suspense } from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn-ui/breadcrumb'
import MuseumCreateFormSection from './museum-create-form-section'

export default function MuseumCreate() {
  return (
    <div>
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-4 pb-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/museum">美術館一覧</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>登録</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">美術館登録</h1>
        </div>

        <Suspense fallback={<div>読み込み中...</div>}>
          <MuseumCreateFormSection />
        </Suspense>
      </div>
    </div>
  )
}
