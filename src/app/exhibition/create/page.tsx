import { ExhibitionCreateForm } from '@/app/exhibition/create/_components/ExhibitionCreateForm'
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
import db from '@/lib/firestore'
import { RawMuseum } from '@/schema/db'
import { convertRawMuseumToMuseum } from '@/schema/converters'

export default async function ExhibitionCreate() {
  const museumCollectionRef = db.collection('museum')
  const museumSnapshot = await museumCollectionRef.orderBy('name', 'asc').get()

  const museums = museumSnapshot.docs.map((doc) => {
    const data = doc.data() as RawMuseum
    return convertRawMuseumToMuseum(doc.id, data)
  })

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
                <Link href="/exhibition">展覧会一覧</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>登録</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">展覧会登録</h1>
        </div>

        <ExhibitionCreateForm museums={museums} />
      </div>
    </div>
  )
}
