import { InstrumentInfoTabProps } from "@/types/components";
import { getImageUrl } from "@/types/image";

function InfoField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-text-muted mb-0.5">{label}</p>
      <p className="text-sm font-medium text-card-text">{value || "-"}</p>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("th-TH-u-ca-buddhist", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function InstrumentInfoTab({ detail }: InstrumentInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* กำหนดการถัดไป */}
      <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5">
        <p className="text-sm font-semibold text-card-text mb-1">กำหนดการถัดไป</p>
        {detail.nextSchedule ? (
          <p className="text-sm text-text-muted">
            รอบที่ {detail.nextSchedule.round} — วันที่ {formatDate(detail.nextSchedule.scheduledDate)}
          </p>
        ) : (
          <p className="text-sm text-text-muted">ไม่มีกำหนดการที่รอดำเนินการ</p>
        )}
      </div>

      {/* แกลเลอรีรูปภาพ */}
      {detail.images.length > 0 && (
        <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5">
          <p className="text-sm font-semibold text-card-text mb-3">รูปภาพ</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {detail.images.map((image) => (
              <div key={image.profileImageId} className="aspect-square bg-surface-muted rounded-xl overflow-hidden">
                <img
                  src={getImageUrl(image.fileName)}
                  alt={detail.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ข้อมูลพื้นฐาน */}
      <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5">
        <p className="text-sm font-semibold text-card-text mb-4">ข้อมูลพื้นฐาน</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <InfoField label="ยี่ห้อ (Brand)" value={detail.brand} />
          <InfoField label="รุ่น (Model)" value={detail.model} />
          <InfoField label="Serial No." value={detail.serialNo} />
          <InfoField label="ขนาด (Size)" value={detail.size} />
          <InfoField label="ผู้ผลิต (Manufacturer)" value={detail.manufacturer} />
          <InfoField label="ผู้จำหน่าย (Vendor)" value={detail.vendor} />
          <InfoField label="ประเทศผู้ผลิต (Country)" value={detail.country} />
          <InfoField label="ราคา (Price)" value={detail.price ? Number(detail.price).toLocaleString("th-TH") : null} />
          <InfoField label="แหล่งเงินทุน (Funding Type)" value={detail.fundingType} />
          {detail.fundingTypeRemark && (
            <InfoField label="ระบุแหล่งเงินทุน (อื่นๆ)" value={detail.fundingTypeRemark} />
          )}
          <InfoField label="สถานที่ติดตั้ง (Location)" value={detail.location} />
          <InfoField label="วันที่ได้รับ (Received Date)" value={formatDate(detail.receivedDate)} />
          <InfoField label="วันที่เริ่มใช้งาน (Active Date)" value={formatDate(detail.activeDate)} />
          <InfoField label="สภาพเมื่อแรกรับ (Initial Condition)" value={detail.initialCondition} />
          <InfoField label="เลขที่เอกสารการเบิก" value={detail.withdrawalDocumentNo} />
          <InfoField label="ผู้บันทึก (Recorded By)" value={detail.recordedBy} />
          {detail.disposed && (
            <InfoField label="วันที่ปลดระวาง" value={formatDate(detail.disposedDate)} />
          )}
        </div>

        {detail.remark && (
          <div className="mt-4 pt-4 border-t border-border">
            <InfoField label="หมายเหตุ" value={detail.remark} />
          </div>
        )}
      </div>

      {/* คุณลักษณะเฉพาะ */}
      {detail.specialCharacteristics.length > 0 && (
        <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5">
          <p className="text-sm font-semibold text-card-text mb-3">คุณลักษณะเฉพาะ</p>
          <div className="space-y-2">
            {detail.specialCharacteristics.map((sc, i) => (
              <div key={i} className="flex flex-wrap gap-x-4 text-sm border-t border-border pt-2 first:border-t-0 first:pt-0">
                <span className="font-medium text-card-text min-w-[120px]">{sc.type}</span>
                <span className="text-text-muted">{sc.value}</span>
                {sc.remark && <span className="text-text-muted italic">({sc.remark})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
