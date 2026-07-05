export default function SidebarLogo() {
  return (
    <div className="h-16 flex items-center gap-3 px-2">
      {/* ยังไม่ได้ใส่ไฟล์จริงๆ และ alt คือข้อความอธิบายรูปภาพ และ ช่วยเรื่อง Accessibility ด้วย */}
      <img
        src="/images/MU.png"
        alt="Logo"
        className="w-10 h-10 object-contain"
      />
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-lg text-mahidol-blue whitespace-nowrap">IMS</span>
        <span className="text-xs text-text-muted whitespace-nowrap">Instrument Management</span>
      </div>
    </div>
  );
}