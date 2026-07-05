export function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-mahidol-blue uppercase tracking-wider mb-4 border-b border-border pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}