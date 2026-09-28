'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Image as ImageIcon, LayoutGrid, LogOut, Plus, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutGrid, exact: true },
  { title: 'Properties', url: '/admin/properties/all', icon: Building2 },
  { title: 'Add property', url: '/admin/properties/new', icon: Plus },
  { title: 'Hero slides', url: '/admin/hero-slides', icon: ImageIcon },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const itemClass =
  'h-10 rounded-lg font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary-foreground [&>svg]:size-[18px]';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-3 pt-5 pb-4">
        <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden rounded-lg px-1">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 20h18" />
              <path d="M5 20V10l7-5 7 5v10" />
              <path d="M10 20v-5h4v5" />
            </svg>
          </span>
          <span className="truncate font-display text-lg font-extrabold tracking-tight text-white group-data-[collapsible=icon]:hidden">
            Ground Link
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.url
                  : pathname === item.url || pathname.startsWith(item.url + '/');

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className={itemClass}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              className={itemClass + ' hover:bg-primary/15 hover:text-primary'}
              onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/login';
              }}
            >
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
