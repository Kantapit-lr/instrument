import { Input } from "@/components/new-instrument/Input";
import { SelectInput } from "@/components/new-instrument/SelectInput";
import { DateInput } from "@/components/new-instrument/DateInput";
import { MaintenanceDetailCardProps } from "@/types/components";
import { SelectOption } from "@/types/instrument";
import { emptySchedule } from "@/types/maintenancePlan";

const DETAIL_STATUS_OPTIONS: SelectOption[] = [
  { value: "รออนุมัติ", label: "รออนุมัติ" },
  { value: "อนุมัติ", label: "อนุมัติ" },
];

export function MaintenanceDetailCard({ detail, index, onChange }: MaintenanceDetailCardProps) {
  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    onChange(index, { ...detail, [name]: value });
  }

  function addSchedule() {
    onChange(index, { ...detail, schedules: [...detail.schedules, { ...emptySchedule }] });
  }

  function updateSchedule(scheduleIndex: number, field: "round" | "scheduledDate", value: string) {
    const updated = [...detail.schedules];
    updated[scheduleIndex] = { ...updated[scheduleIndex], [field]: value };
    onChange(index, { ...detail, schedules: updated });
  }

  function removeSchedule(scheduleIndex: number) {
    onChange(index, { ...detail, schedules: detail.schedules.filter((_, i) => i !== scheduleIndex) });
  }

  return (
    <div className="border border-border rounded-xl p-4 space-y-4 bg-surface-muted">
      <p className="text-sm font-semibold text-card-text">{detail.instrumentLabel}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="สถานะผู้รับดำเนินการ"
          name="status"
          value={detail.status}
          onChange={handleFieldChange}
          options={DETAIL_STATUS_OPTIONS}
          placeholder="เลือกสถานะ"
          required
        />
        <Input
          label="รายละเอียดงาน"
          name="detail"
          value={detail.detail}
          onChange={handleFieldChange}
          placeholder="เช่น สอบเทียบตามมาตรฐาน ISO"
          required
        />
        <div className="md:col-span-2">
          <Input
            label="หมายเหตุ"
            name="remark"
            value={detail.remark}
            onChange={handleFieldChange}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-border">
        <p className="text-sm font-medium text-card-text">รอบกำหนดการ</p>

        {detail.schedules.map((schedule, scheduleIndex) => (
          <div key={scheduleIndex} className="flex items-end gap-3">
            <div className="w-24">
              <Input
                label="รอบที่"
                name="round"
                type="number"
                min="1"
                value={schedule.round}
                onChange={(e) => updateSchedule(scheduleIndex, "round", e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <DateInput
                label="วันที่กำหนด"
                name="scheduledDate"
                value={schedule.scheduledDate}
                onChange={(e) => updateSchedule(scheduleIndex, "scheduledDate", e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              onClick={() => removeSchedule(scheduleIndex)}
              className="px-3 py-2.5 text-sm text-danger-text bg-danger-bg border border-danger-border rounded-xl hover:opacity-80 transition-opacity"
            >
              ลบ
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSchedule}
          className="text-sm font-medium text-action-text hover:underline"
        >
          + เพิ่มรอบกำหนดการ
        </button>
      </div>
    </div>
  );
}
