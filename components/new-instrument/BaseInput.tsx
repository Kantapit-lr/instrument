// คลาสกลางของทุก field ในฟอร์ม (input/select/textarea ใช้ตัวเดียวกันหมด)
// แก้ตรงนี้ที่เดียว ทุก field ในฟอร์มจะอัปเดตตาม ไม่ต้องไล่แก้หลายไฟล์เหมือนเมื่อก่อน
export const fieldClass =
  "w-full px-4 py-2.5 bg-surface-muted text-surface-muted-text border border-border rounded-xl outline-none focus:ring-2 focus:ring-mahidol-blue/20 transition-all";

export const labelClass = "text-sm font-medium text-card-text";

// ครอบ label + field (input/select/textarea ที่ส่งมาทาง children) ให้หน้าตาเหมือนกันทุกตัว
export function BaseField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
