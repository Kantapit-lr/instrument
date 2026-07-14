import { InstrumentType } from "./instrument";

// ข้อมูลเต็มของอุปกรณ์ 1 ชิ้น สำหรับหน้ารายละเอียด (ต่างจาก InstrumentFormData ตรงที่เป็น
// read-only display data ไม่ใช่โครงฟอร์ม และมีข้อมูลที่ฟอร์มไม่ต้องใช้ เช่น รูปภาพ, กำหนดการถัดไป)
export interface InstrumentDetailData {
  registrationNumber: string;
  name: string;
  type: InstrumentType;
  brand: string | null;
  model: string | null;
  serialNo: string | null;
  size: string | null;
  manufacturer: string | null;
  vendor: string | null;
  country: string | null;
  price: string;
  fundingType: string;
  fundingTypeRemark: string | null;
  location: string;
  receivedDate: string;
  activeDate: string;
  initialCondition: string;
  withdrawalDocumentNo: string;
  recordedBy: string;
  remark: string | null;
  disposed: boolean;
  disposedDate: string | null;
  projectName: string;
  images: { profileImageId: number; fileName: string }[];
  specialCharacteristics: { type: string; value: string; remark: string | null }[];
  nextSchedule: {
    scheduledDate: string;
    round: number;
  } | null;
}

export type HistoryActionType = "CAL" | "PM" | "TRANSFER" | "MANUAL";

// 1 แถวประวัติ สำหรับแสดงในแท็บ "ประวัติ"
export interface HistoryItem {
  historyId: number;
  actionDate: string;
  actionType: HistoryActionType;
  detail: string | null;
  operator: string;
  remark: string | null;
  calibrationId: number | null; // มีค่า = มาจากการบันทึกผลสอบเทียบอัตโนมัติ แก้/ลบเองไม่ได้
}

// ฟอร์มเพิ่ม/แก้ไขประวัติด้วยมือ — เลือกได้ทุกประเภทรวมถึง CAL ด้วย (เผื่อกรอกประวัติสอบเทียบ
// ย้อนหลังที่เกิดขึ้นก่อนมีระบบนี้ ซึ่งไม่มี Calibration record จริงมารองรับอยู่แล้ว จึงไม่ชนกับ
// รายการ CAL ที่ผูก calibrationId ที่มาจากหน้า /calibrations โดยตรง)
export interface HistoryFormData {
  actionDate: string;
  actionType: HistoryActionType;
  detail: string;
  operator: string;
  remark: string;
}

export const emptyHistoryForm: HistoryFormData = {
  actionDate: "",
  actionType: "MANUAL",
  detail: "",
  operator: "",
  remark: "",
};
