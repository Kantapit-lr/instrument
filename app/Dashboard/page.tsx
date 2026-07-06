import { StatCard } from "@/components/dashboard/StatCard";
import { CalibrationScheduleCard } from "@/components/dashboard/CalibrationScheduleCard";
import { GoalGaugeCard } from "@/components/dashboard/GoalGaugeCard";
import { CalibrationScheduleRow } from "@/types/dashboard";

// TODO: แทนที่ mock ด้านล่างด้วยข้อมูลจริงจาก services/calibrationService.ts
// เมื่อสร้างระบบ Calibration เสร็จแล้ว (ตอนนี้ schema เสร็จแล้ว รอทำหน้าและ service)
const MOCK_STATS = {
  thisMonth: 2,
  nextMonth: 5,
  nextQuarter: 18,
  queue: 28,
  completed: 10,
  goalPercent: 26,
};

const MOCK_ROWS: CalibrationScheduleRow[] = [
  {
    registrationNumber: "0459021-0124214212-12102",
    instrumentName: "ตู้ควบคุมอุณหภูมิ 4 องศาเซลเซียส",
    operator: "Dr.Calibation",
  },
  {
    registrationNumber: "0459021-0121121422-12103",
    instrumentName: "ตู้ควบคุมอุณหภูมิ 4 องศาเซลเซียส",
    operator: "Dr.Calibation",
  },
];

function Dashboard() {
  const monthTitle = new Date().toLocaleDateString("th-TH-u-ca-buddhist", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* แถวบน: สรุปตัวเลขภาพรวม */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="เดือนนี้" value={MOCK_STATS.thisMonth} />
        <StatCard title="เดือนหน้า" value={MOCK_STATS.nextMonth} />
        <StatCard title="ไตรมาสหน้า" value={MOCK_STATS.nextQuarter} />
        <StatCard title="คิวรอดำเนินการ" value={MOCK_STATS.queue} />
      </div>

      {/* แถวล่าง: ตารางรายการสอบเทียบ + สรุปเสร็จสิ้น/เป้าหมาย */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        <div className="lg:col-span-3">
          <CalibrationScheduleCard
            title={`เครื่องมือสอบเทียบประจำเดือน ${monthTitle}`}
            rows={MOCK_ROWS}
          />
        </div>

        <div className="flex flex-col gap-4">
          <StatCard title="เสร็จสิ้นแล้ว" value={MOCK_STATS.completed} />
          <GoalGaugeCard title="เป้าหมายประจำปี" percent={MOCK_STATS.goalPercent} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
