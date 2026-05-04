import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/shadcn-ui/sidebar'
import { GalleryHorizontal, Ban, Building2 } from 'lucide-react'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import db from '@/lib/firestore'
import { convertRawMuseumToMuseum } from '@/schema/converters'
import type { RawMuseum } from '@/schema/db'

export async function AppSidebar() {
  noStore()

  const museumsSnapshot = await db.collection('museum').get()
  const museums = museumsSnapshot.docs
    .map((doc) => {
      const data = doc.data() as RawMuseum
      return convertRawMuseumToMuseum(doc.id, data)
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/exhibition">
                    <GalleryHorizontal />
                    <span>展覧会管理</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/exhibition/excluded">
                    <Ban />
                    <span>除外展覧会</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/museum">
                    <Building2 />
                    <span>美術館管理</span>
                  </Link>
                </SidebarMenuButton>
                {museums.length > 0 && (
                  <SidebarMenuSub>
                    {museums.map((museum) => (
                      <SidebarMenuSubItem key={museum.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/museum/${museum.id}`}>
                            <span>{museum.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
