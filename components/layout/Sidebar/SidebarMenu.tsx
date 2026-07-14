"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenuProps } from '@/types/components';

export default function SidebarMenu({ onNavigate }: SidebarMenuProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'New-instrument', href: '/new-instrument' },
    { name: 'Instrument', href: '/instruments' },
    { name: 'Projects', href: '/projects' },
    { name: 'Annual-plans', href: '/annual-plans' },
    { name: 'Schedules', href: '/schedules' },
    { name: 'Calibrations', href: '/calibrations' },
  ];

  return (
    <nav className="mt-6 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={
              isActive
                ? "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium bg-mahidol-blue/10 text-mahidol-blue transition-colors"
                : "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-sidebar-text hover:bg-black/5 transition-colors"
            }
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
