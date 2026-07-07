import { RequestDetailRowProps } from "@/types/components";
import { Input } from "@/components/new-instrument/Input";
import { SelectInput } from "@/components/new-instrument/SelectInput";

export function RequestDetailRow({
  detail,
  index,
  instrumentOptions,
  onChange,
  onRemove,
}: RequestDetailRowProps) {
  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    onChange(index, { ...detail, [name]: value });
  }

  return (
    <div className="border border-border rounded-xl p-4 space-y-4 bg-surface-muted">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-card-text">รายการที่ {index + 1}</p>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-sm text-danger-text hover:underline"
        >
          ลบรายการนี้
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="อุปกรณ์"
          name="registrationNumber"
          value={detail.registrationNumber}
          onChange={handleFieldChange}
          options={instrumentOptions}
          required
        />
        <Input
          label="ความถี่ (ครั้ง/ปี)"
          name="frequency"
          type="number"
          min="1"
          value={detail.frequency}
          onChange={handleFieldChange}
          required
        />
        <Input
          label="ช่วงการใช้งาน"
          name="usagePeriod"
          value={detail.usagePeriod}
          onChange={handleFieldChange}
          placeholder="เช่น ใช้งานต่อเนื่องตลอดปี"
        />
        <Input
          label="ค่าความคลาดเคลื่อนที่ยอมรับได้"
          name="acceptableTolerance"
          type="number"
          step="0.01"
          value={detail.acceptableTolerance}
          onChange={handleFieldChange}
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
    </div>
  );
}
