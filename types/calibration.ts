export type CalibrationResultStatus = "PASS" | "NOT_PASS";

export const RESULT_STATUS_OPTIONS = [
  { value: "PASS", label: "ผ่าน (PASS)" },
  { value: "NOT_PASS", label: "ไม่ผ่าน (NOT_PASS)" },
];

// จุดทดสอบของเครื่องชั่ง (BALANCE) — เพิ่ม/ลบจุดได้เอง
export interface ResultBalanceInput {
  appliedWeight: string;
  balanceReading: string;
  unit: string;
  correction: string;
  mu: string;
  totalErrorMinus: string;
  totalErrorPlus: string;
  status: CalibrationResultStatus | "";
}

export const emptyResultBalance: ResultBalanceInput = {
  appliedWeight: "",
  balanceReading: "",
  unit: "",
  correction: "",
  mu: "",
  totalErrorMinus: "",
  totalErrorPlus: "",
  status: "",
};

// จุดทดสอบของเครื่องควบคุมอุณหภูมิ (TEMPERATURE)
export interface ResultTemperatureInput {
  position: string;
  standardReading: string;
  unit: string;
  mu: string;
  averageStandardReadingMc: string;
  status: CalibrationResultStatus | "";
}

export const emptyResultTemperature: ResultTemperatureInput = {
  position: "",
  standardReading: "",
  unit: "",
  mu: "",
  averageStandardReadingMc: "",
  status: "",
};

// จุดทดสอบของปิเปต (PIPETTE)
export interface ResultPipetteInput {
  parameter: string;
  pointOfCalibration: string;
  unit: string;
  mpePercent: string;
  error: string;
  ms: string;
  totalError: string;
  status: CalibrationResultStatus | "";
}

export const emptyResultPipette: ResultPipetteInput = {
  parameter: "",
  pointOfCalibration: "",
  unit: "",
  mpePercent: "",
  error: "",
  ms: "",
  totalError: "",
  status: "",
};

// รอบกำหนดการที่ยังไม่มีผลสอบเทียบ (ดึงมาให้เลือกตอนสร้างใบผล)
export interface OpenScheduleOption {
  scheduleId: number;
  round: number;
  registrationNumber: string;
  maintenancePlanId: number;
  instrumentType: "BALANCE" | "TEMPERATURE" | "PIPETTE";
  label: string;
}

// โครงข้อมูลฟอร์มบันทึกผลสอบเทียบ 1 ใบ
export interface CalibrationFormData {
  scheduleId: string;
  registrationNumber: string; // เติมอัตโนมัติตามรอบที่เลือก
  maintenancePlanId: string; // เติมอัตโนมัติตามรอบที่เลือก
  instrumentType: "BALANCE" | "TEMPERATURE" | "PIPETTE" | "";
  certificateNo: string;
  calibrationDate: string;
  isAccurate: boolean;
  isDocumentComplete: boolean;
  isInstrumentComplete: boolean;
  instrumentValue: string;
  mpe: string;
  summaryResult: CalibrationResultStatus | "";
  operator: string;
  operatedAt: string;
  reviewer: string;
  reviewedAt: string;
  resultBalances: ResultBalanceInput[];
  resultTemperatures: ResultTemperatureInput[];
  resultPipettes: ResultPipetteInput[];
}

export const emptyCalibrationForm: CalibrationFormData = {
  scheduleId: "",
  registrationNumber: "",
  maintenancePlanId: "",
  instrumentType: "",
  certificateNo: "",
  calibrationDate: "",
  isAccurate: false,
  isDocumentComplete: false,
  isInstrumentComplete: false,
  instrumentValue: "",
  mpe: "",
  summaryResult: "",
  operator: "",
  operatedAt: "",
  reviewer: "",
  reviewedAt: "",
  resultBalances: [],
  resultTemperatures: [],
  resultPipettes: [],
};

// ข้อมูลย่อสำหรับแสดงเป็นแถวในตาราง /calibrations
export interface CalibrationItem {
  calibrationId: number;
  instrumentName: string;
  registrationNumber: string;
  round: number;
  certificateNo: string;
  calibrationDate: string;
  summaryResult: CalibrationResultStatus;
  hasCertificateFile: boolean;
}
