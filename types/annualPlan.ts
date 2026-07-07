// สถานะของแผนรายปี — dropdown ตายตัว 3 ค่า
export type RequestListStatus = "ร่าง" | "เสนอแล้ว" | "อนุมัติแล้ว";

// รายละเอียดความต้องการต่ออุปกรณ์ 1 ชิ้นในแผน (ตรงกับ model RequestDetail)
// requirementType ผูกไว้เป็น "CAL" คงที่ก่อนใน MVP นี้ (ระบบยังไม่มีตารางผลของ PM)
export interface RequestDetailInput {
  registrationNumber: string;
  requirementType: "CAL";
  frequency: string; // จำนวนครั้ง/ปี — เก็บเป็น string ตอนอยู่ในฟอร์ม แปลงเป็น Int ก่อนส่ง API
  usagePeriod: string;
  acceptableTolerance: string; // เก็บเป็น string ตอนอยู่ในฟอร์ม แปลงเป็น Decimal ก่อนส่ง API
  remark: string;
}

export const emptyRequestDetail: RequestDetailInput = {
  registrationNumber: "",
  requirementType: "CAL",
  frequency: "",
  usagePeriod: "",
  acceptableTolerance: "",
  remark: "",
};

// โครงข้อมูลฟอร์ม "แผนรายปี" (RequestList + รายการอุปกรณ์ที่อยู่ในแผน)
export interface RequestListFormData {
  projectId: string;
  year: string; // ปี พ.ศ. — เก็บเป็น string ตอนอยู่ในฟอร์ม แปลงเป็น Int ก่อนส่ง API
  operator: string;
  status: RequestListStatus | "";
  details: RequestDetailInput[];
}

export const emptyRequestListForm: RequestListFormData = {
  projectId: "",
  year: "",
  operator: "",
  status: "",
  details: [],
};

// ข้อมูลย่อสำหรับแสดงเป็นแถวในตาราง /annual-plans
export interface RequestListItem {
  requestListId: number;
  projectName: string;
  year: number;
  operator: string;
  status: string;
  detailCount: number;
}
