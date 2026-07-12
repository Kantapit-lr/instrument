import { notFound } from "next/navigation";
import { getInstrumentDetail } from "@/services/instrumentService";
import { InstrumentDetailHeader } from "@/components/instrument-detail/InstrumentDetailHeader";
import { InstrumentDetailTabs } from "@/components/instrument-detail/InstrumentDetailTabs";

export default async function InstrumentDetailPage({
  params,
}: {
  params: Promise<{ registrationNumber: string }>;
}) {
  const { registrationNumber } = await params;
  const detail = await getInstrumentDetail(registrationNumber);

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <InstrumentDetailHeader detail={detail} />
      <InstrumentDetailTabs detail={detail} />
    </div>
  );
}
