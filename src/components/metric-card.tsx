type MetricCardProps = {
  label: string;
  value: string;
};

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="app-surface px-4 py-4 md:px-5">
      <p className="text-sm font-medium text-[var(--foreground-soft)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
    </div>
  );
}
