export interface ProfileImageData {
  profileImageId: number;
  registrationNumber: string;
  fileName: string;
  sortOrder: number;
}

// URL ที่ใช้แสดงรูปจริงใน <img>, สร้างจาก fileName ผ่าน API route เสิร์ฟไฟล์
export function getImageUrl(fileName: string): string {
  return `/api/uploads/instruments/${fileName}`;
}
