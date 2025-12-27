"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:hidden">FinanceFriend</h1>
      </div>
    </header>
  );
}