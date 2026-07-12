import { GoalGaugeCardProps } from "@/types/components";

export function GoalGaugeCard({ title, percent }: GoalGaugeCardProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 80;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5">
      <p className="text-sm font-semibold text-card-text mb-1">{title}</p>

      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 200 110" className="w-full max-w-[200px]">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            strokeWidth="16"
            strokeLinecap="round"
            style={{ stroke: "var(--color-border)" }}
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ stroke: "var(--color-primary)" }}
          />
          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="fill-card-text"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            {clamped}%
          </text>
        </svg>
      </div>
    </div>
  );
}
