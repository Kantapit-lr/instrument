import "./globals.css";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Topbar from "@/components/layout/Topbar/Topbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex bg-background text-foreground">
        {/* 1. Sidebar อยู่ฝั่งซ้าย */}
        <Sidebar />

        {/* 2. ฝั่งขวาทั้งหมด: ใช้สีเทาอ่อนตามที่ตั้งไว้ในตัวแปรระบบ */}
        <div className="flex-1 pl-64 flex flex-col min-h-screen">
          
          {/* Topbar โปร่งใส */}
          <Topbar />
          
          {/* เนื้อหาหลักสำหรับวาง Grid */}
          <main className="flex-1 p-6 pt-2">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}