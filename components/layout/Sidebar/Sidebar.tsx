import SidebarLogo from './SidebarLogo';
import SidebarMenu from './SidebarMenu';

export default function Sidebar() {
  return (
    <aside className="w-64 h-[calc(100vh-1rem)] bg-sidebar text-sidebar-text fixed top-2 left-2 flex flex-col justify-between p-4 border border-border shadow-sm z-20 gap-4 rounded-lg">
      <div>
        {/* ส่วนหัว: โลโก้แบรนด์ระบบ */}
        <SidebarLogo />

        {/* ส่วนกลาง: รายการเมนูนำทาง */}
        <SidebarMenu />
      </div>

      {/* ส่วนท้าย: ชื่อสถาบัน */}
      <div className="p-2 text-xs text-text-muted font-medium">
        Mahidol University
      </div>
    </aside>
  );
}