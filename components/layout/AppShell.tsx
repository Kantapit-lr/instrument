"use client";

import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import { AppShellProps } from "@/types/components";

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* 1. Sidebar อยู่ฝั่งซ้าย — จอเล็กซ่อนไว้เป็น overlay, จอใหญ่เปิดค้างเหมือนเดิม */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 2. ฝั่งขวาทั้งหมด: เว้นที่ให้ sidebar เฉพาะจอใหญ่ (md ขึ้นไป) */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Topbar โปร่งใส */}
        <Topbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        {/* เนื้อหาหลักสำหรับวาง Grid */}
        <main className="flex-1 p-6 pt-2">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </>
  );
}
