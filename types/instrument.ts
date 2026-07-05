// ชนิดของอุปกรณ์ ต้องตรงกับ enum InstrumentType ใน prisma/schema.prisma
export type InstrumentType = "BALANCE" | "TEMPERATURE" | "PIPETTE";

// ตัวเลือกสำหรับ dropdown (ใช้กับ "ประเภท" และ "โครงการ")
export interface SelectOption {
  value: string;
  label: string;
}

// โครงข้อมูลฟอร์ม "เพิ่มอุปกรณ์ใหม่" (ตรงกับ field ของ model Profile)
export interface InstrumentFormData {
  registrationNumber: string;
  name: string;
  type: InstrumentType | "";
  brand: string;
  model: string;
  serialNo: string;
  projectId: string; // เก็บเป็น string ตอนอยู่ใน form (ค่าจาก <select>) แปลงเป็น number ก่อนส่ง API

  size: string;
  manufacturer: string;
  vendor: string;       // ผู้จำหน่าย (nullable ใน DB)
  country: string;
  price: string; // เก็บเป็น string ตอนอยู่ใน form แปลงเป็น number ก่อนส่ง API
  fundingType: string;
  fundingTypeRemark: string; // ระบุรายละเอียดเมื่อ fundingType = "อื่นๆ"

  location: string;
  receivedDate: string; // yyyy-mm-dd จาก <input type="date">
  activeDate: string;
  initialCondition: string;

  withdrawalDocumentNo: string;
  recordedBy: string;
  remark: string;

  // คุณลักษณะเฉพาะ — เก็บเป็น array ใน form แล้วส่งพร้อมกับข้อมูลหลัก
  specialCharacteristics: SpecialCharacteristicInput[];
}

export interface SpecialCharacteristicInput {
  type: string;
  value: string;
  remark: string;
}

export const emptyInstrumentForm: InstrumentFormData = {
  registrationNumber: "",
  name: "",
  type: "",
  brand: "",
  model: "",
  serialNo: "",
  projectId: "",
  size: "",
  manufacturer: "",
  vendor: "",
  country: "",
  price: "",
  fundingType: "",
  fundingTypeRemark: "",
  location: "",
  receivedDate: "",
  activeDate: "",
  initialCondition: "",
  withdrawalDocumentNo: "",
  recordedBy: "",
  remark: "",
  specialCharacteristics: [],
};

// ข้อมูลย่อสำหรับแสดงเป็นการ์ดใน list/search/autocomplete
// ไม่เอาทุก field ของ Profile มา เอาแค่ที่จำเป็นต้องโชว์ในการ์ด
export interface InstrumentListItem {
  registrationNumber: string;
  name: string;
  type: InstrumentType;
  projectName: string;
  coverImageFileName: string | null; // รูปแรกของ gallery ใช้เป็นรูปหน้าปกการ์ด ไม่มีรูปก็เป็น null
}
