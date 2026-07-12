"use client";

import { Menu } from "lucide-react";
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import { TopbarProps } from '@/types/components';

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="h-20 flex items-center justify-between gap-4 px-4 md:px-6 bg-transparent">
      {/* ปุ่มเปิด/ปิด sidebar — แสดงเฉพาะจอเล็ก (มือถือ/แท็บเล็ต) */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="md:hidden shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-card text-card-text hover:bg-surface-muted transition-colors"
        aria-label="เปิด/ปิดเมนู"
      >
        <Menu size={20} />
      </button>

      {/* ฝั่งซ้าย: ช่องค้นหา */}
      <SearchBar />

      {/* ฝั่งขวา: ข้อมูลผู้ใช้งาน */}
      <UserProfile />
    </header>
  );
}
