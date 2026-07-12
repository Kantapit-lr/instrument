import { StatCardProps } from "@/types/components";

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5 flex flex-col justify-between min-h-[130px]">
      <p className="text-sm font-semibold text-card-text">{title}</p>
      <p className="text-3xl md:text-4xl font-bold mt-3">{value}</p>
    </div>
  );
}
