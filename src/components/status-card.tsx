import { ReactNode } from "react";

type StatusBadge = { label: string; tone?: "primary" | "warning" };

type StatusCardProps = {
  label: string;
  value: string;
  metric?: string;
  unit?: string;
  hint?: string;
  icon?: ReactNode;
  badges?: Array<{ label: string; tone?: "primary" | "warning" }>;
  ornamentKind?: "orbit";
  accentClassName?: string;
};

function getBadgeClassName(tone: StatusBadge["tone"]) {
  if (tone === "warning") {
    return "bg-[rgba(255,246,234,0.96)] text-[#9a5b0c]";
  }

  return "bg-[rgba(238,248,244,0.98)] text-[var(--primary)]";
}

export function StatusCard({
  label,
  value,
  metric,
  unit,
  hint,
  icon,
  badges,
  ornamentKind,
  accentClassName,
}: StatusCardProps) {
  return (
    <div
      className={[
        "app-surface app-soft-ring relative overflow-hidden px-4 py-4 md:px-5 md:py-5",
        accentClassName ?? "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9)_0,rgba(255,255,255,0)_38%)]" />
      {ornamentKind === "orbit" ? (
        <>
          <div className="pointer-events-none absolute -bottom-6 right-[-6px] h-28 w-28 rounded-full border border-[rgba(19,111,99,0.14)]" />
          <div className="pointer-events-none absolute bottom-2 right-4 h-16 w-16 rounded-full border border-[rgba(19,111,99,0.1)]" />
        </>
      ) : null}

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--foreground-soft)]">{label}</p>
        {icon ? (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/78 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
            {icon}
          </span>
        ) : null}
      </div>

      {metric && unit ? (
        <div className="relative mt-3 flex items-end gap-2">
          <p className="text-[42px] font-semibold leading-none tracking-[-0.04em] text-[var(--foreground)] md:text-[46px]">
            {metric}
          </p>
          <span className="mb-1 inline-flex items-center rounded-full border border-[rgba(216,230,225,0.96)] bg-[rgba(248,252,250,0.96)] px-2.5 py-1 text-[12px] font-medium leading-none text-[var(--foreground-soft)]">
            {unit}
          </span>
        </div>
      ) : (
        <p className="mt-2 text-[28px] font-semibold tracking-tight text-[var(--foreground)] md:text-[30px]">
          {value}
        </p>
      )}

      {badges?.length ? (
        <div className="relative mt-3 inline-flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={`${badge.label}-${badge.tone ?? "primary"}`}
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
                getBadgeClassName(badge.tone),
              ].join(" ")}
            >
              {badge.label}
            </span>
          ))}
        </div>
      ) : null}

      {hint ? <p className="mt-2 text-xs text-[var(--foreground-faint)]">{hint}</p> : null}
    </div>
  );
}
