import { ArrowUpRight } from "lucide-react";
import { StatCardProps } from "@/types/components";

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-card text-card-text rounded-2xl border border-border shadow-sm p-5 flex flex-col justify-between min-h-[130px]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-card-text">{title}</p>
        <span className="shrink-0 w-8 h-8 rounded-full bg-mahidol-blue/10 text-action-text flex items-center justify-center">
          {Icon ? <Icon size={16} /> : <ArrowUpRight size={16} />}
        </span>
      </div>
      <p className="text-3xl md:text-4xl font-bold mt-3">{value}</p>
    </div>
  );
}
