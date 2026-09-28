import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="h-svh overflow-hidden bg-background">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/85 px-4 backdrop-blur-xl lg:px-8">
          <SidebarTrigger className="-ml-1" />
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link href="/" target="_blank">
              View site <ExternalLink />
            </Link>
          </Button>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 lg:py-10">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
