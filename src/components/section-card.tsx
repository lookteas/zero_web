import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-[24px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(238,248,247,0.94)_100%)] px-4 py-4 shadow-[var(--shadow-card)] md:px-6 md:py-6">
      <div className="mb-4 md:mb-5">
        <h2 className="text-[18px] font-semibold tracking-tight text-[var(--foreground)] md:text-[22px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[14px] leading-6 text-[var(--foreground-soft)] md:text-[15px] md:leading-7">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
