// พารามิเตอร์ของ dynamic route ต่างๆ ใน app/api
// Next.js 16: params เป็น Promise เสมอ (ต้อง await ก่อนใช้)

export interface ProjectIdRouteParams {
  params: Promise<{ id: string }>;
}

export interface InstrumentImageIdRouteParams {
  params: Promise<{ id: string }>;
}

export interface UploadFileNameRouteParams {
  params: Promise<{ fileName: string }>;
}

export interface InstrumentRegistrationRouteParams {
  params: Promise<{ registrationNumber: string }>;
}
