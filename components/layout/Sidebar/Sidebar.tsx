"use client";

import SidebarLogo from './SidebarLogo';
import SidebarMenu from './SidebarMenu';
import { SidebarProps } from '@/types/components';

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay ทับพื้นหลัง — จอเล็กเท่านั้น แสดงตอน sidebar เปิดอยู่ กดแล้วปิด */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-64 h-[calc(100vh-1rem)] bg-sidebar text-sidebar-text fixed top-2 left-2 flex flex-col justify-between p-4 border border-border shadow-sm z-40 gap-4 rounded-lg
        transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"} md:translate-x-0`}
      >
        <div>
          {/* ส่วนหัว: โลโก้แบรนด์ระบบ */}
          <SidebarLogo />

          {/* ส่วนกลาง: รายการเมนูนำทาง — กดเมนูแล้วปิด sidebar อัตโนมัติ (มีผลแค่จอเล็ก) */}
          <SidebarMenu onNavigate={onClose} />
        </div>

        {/* ส่วนท้าย: ชื่อสถาบัน */}
        <div className="p-2 text-xs text-text-muted font-medium">
          Mahidol University
        </div>
      </aside>
    </>
  );
}
