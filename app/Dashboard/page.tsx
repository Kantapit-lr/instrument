import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardScheduleSection } from "@/components/dashboard/DashboardScheduleSection";
import { getDashboardStats, getScheduleRowsForMonth } from "@/services/dashboardService";

// Server Component: ดึงข้อมูลจริงตรงจาก service (ไม่ต้องผ่าน API route เพราะ render ฝั่ง server)
async function Dashboard() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [stats, initialRows] = await Promise.all([
    getDashboardStats(),
    getScheduleRowsForMonth(currentYear, currentMonth),
  ]);

  return (
    <div className="space-y-4">
      {/* แถวบน: สรุปตัวเลขภาพรวม (เฉพาะปี พ.ศ. ปัจจุบัน) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="เดือนนี้" value={stats.thisMonth} />
        <StatCard title="เดือนหน้า" value={stats.nextMonth} />
        <StatCard title="ไตรมาสหน้า" value={stats.nextQuarter} />
        <StatCard title="คิวรอดำเนินการ" value={stats.queue} />
      </div>

      {/* แถวล่าง: ตาราง/ปฏิทินรายการสอบเทียบ + สรุปเสร็จสิ้น/เป้าหมาย (+ agenda เดือน ตอนเปิดปฏิทิน) */}
      <DashboardScheduleSection
        initialRows={initialRows}
        initialYear={currentYear}
        initialMonth={currentMonth}
        completed={stats.completed}
        goalPercent={stats.goalPercent}
      />
    </div>
  );
}

export default Dashboard;
