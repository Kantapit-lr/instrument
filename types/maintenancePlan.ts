// สถานะทั้ง 3 ตัวของ MaintenancePlan (dropdown ตายตัวตามที่ตกลงกัน)
export type ApprovalStatus = "รอดำเนินการ" | "อยู่ระหว่างการตรวจสอบ" | "อนุมัติ" | "ไม่อนุมัติ";
export type HiringStatus = "ยังไม่มีการดำเนินการ" | "บางส่วน" | "เสร็จสิ้น";
export type ProcessStatus = "อยู่ระหว่างการดำเนินการ" | "เสร็จสิ้น";

// สถานะของ MaintenanceDetail — สถานะบริษัท/ผู้รับจ้างที่จะมาดูแลอุปกรณ์ชิ้นนี้
export type MaintenanceDetailStatus = "รออนุมัติ" | "อนุมัติ";

// 1 รอบของกำหนดการ (Schedule) — วันที่กรอกเองทุกรอบ ไม่มี auto-suggest
export interface ScheduleInput {
  round: string; // ลำดับรอบ — เก็บเป็น string ในฟอร์ม แปลงเป็น Int ก่อนส่ง API
  scheduledDate: string; // yyyy-mm-dd
}

export const emptySchedule: ScheduleInput = {
  round: "",
  scheduledDate: "",
};

// รายละเอียดกำหนดการต่ออุปกรณ์ 1 ชิ้น (ตรงกับ model MaintenanceDetail)
export interface MaintenanceDetailInput {
  registrationNumber: string;
  instrumentLabel: string; // ชื่ออุปกรณ์ไว้แสดงผลอย่างเดียว (มาจาก RequestDetail ที่เลือกไว้ ไม่ได้ส่งเข้า API)
  status: MaintenanceDetailStatus | "";
  detail: string;
  remark: string;
  schedules: ScheduleInput[];
}

// โครงข้อมูลฟอร์ม "กำหนดการ" (MaintenancePlan + รายละเอียดอุปกรณ์ + รอบกำหนดการ)
export interface MaintenancePlanFormData {
  requestListId: string; // เลือกจากแผนรายปีที่อนุมัติแล้วเท่านั้น
  projectId: string; // เติมอัตโนมัติตามแผนที่เลือก (read-only ในฟอร์ม)
  year: string;
  operator: string;
  reviewer: string;
  approvalStatus: ApprovalStatus | "";
  hiringStatus: HiringStatus | "";
  processStatus: ProcessStatus | "";
  details: MaintenanceDetailInput[];
}

export const emptyMaintenancePlanForm: MaintenancePlanFormData = {
  requestListId: "",
  projectId: "",
  year: "",
  operator: "",
  reviewer: "",
  approvalStatus: "",
  hiringStatus: "",
  processStatus: "",
  details: [],
};

// ข้อมูลย่อสำหรับแสดงเป็นแถวในตาราง /schedules
export interface MaintenancePlanItem {
  maintenancePlanId: number;
  projectName: string;
  year: number;
  operator: string;
  approvalStatus: string;
  hiringStatus: string;
  processStatus: string;
  detailCount: number;
}
