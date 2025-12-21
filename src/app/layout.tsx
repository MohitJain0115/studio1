import type { Metadata } from 'next';
import './globals.css';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import NavigationMenu from '@/components/navigation-menu';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Travel-Friend',
  description: 'All your travel calculators in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <h2 className="text-xl font-semibold tracking-tight p-2">
                Travel-Friend
              </h2>
            </SidebarHeader>
            <SidebarContent>
              <NavigationMenu />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
