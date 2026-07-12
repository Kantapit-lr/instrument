import { ResultRowsEditorProps } from "@/types/components";
import { Input } from "@/components/new-instrument/Input";
import { SelectInput } from "@/components/new-instrument/SelectInput";
import { RESULT_STATUS_OPTIONS } from "@/types/calibration";

export function ResultRowsEditor({ rows, fields, onChange }: ResultRowsEditorProps) {
  function updateCell(rowIndex: number, name: string, value: string) {
    const updated = [...rows];
    updated[rowIndex] = { ...updated[rowIndex], [name]: value };
    onChange(updated);
  }

  function addRow() {
    const blank: Record<string, string> = { status: "" };
    fields.forEach((f) => (blank[f.name] = ""));
    onChange([...rows, blank]);
  }

  function removeRow(rowIndex: number) {
    onChange(rows.filter((_, i) => i !== rowIndex));
  }

  return (
    <div className="space-y-4">
      {rows.length === 0 && (
        <p className="text-sm text-text-muted">ยังไม่มีจุดทดสอบ กดปุ่มด้านล่างเพื่อเพิ่ม</p>
      )}

      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="border border-border rounded-xl p-4 bg-surface-muted space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-card-text">จุดที่ {rowIndex + 1}</p>
            <button
              type="button"
              onClick={() => removeRow(rowIndex)}
              className="text-sm text-danger-text hover:underline"
            >
              ลบจุดนี้
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <Input
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type ?? "text"}
                step={field.type === "number" ? "0.0001" : undefined}
                value={row[field.name] ?? ""}
                onChange={(e) => updateCell(rowIndex, field.name, e.target.value)}
                required
              />
            ))}
            <SelectInput
              label="ผลจุดนี้"
              name="status"
              value={row.status ?? ""}
              onChange={(e) => updateCell(rowIndex, "status", e.target.value)}
              options={RESULT_STATUS_OPTIONS}
              placeholder="เลือกผล"
              required
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="text-sm font-medium text-action-text hover:underline"
      >
        + เพิ่มจุดทดสอบ
      </button>
    </div>
  );
}
