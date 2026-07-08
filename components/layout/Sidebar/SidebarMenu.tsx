"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarMenu() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'New intrument', href: '/new-instrument' },
    { name: 'Instruments', href: '/instruments' },
    { name: 'Project', href: '/projects' },
    { name: 'Annual Plan', href: '/annual-plans' },
    { name: 'Schedules', href: '/schedules' },

  ];

  return (
    <nav className="mt-6 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
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