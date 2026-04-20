type PageHeroProps = {
  title: string;
  description?: string;
};

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="app-surface px-4 py-4 md:px-7 md:py-6">
      <p className="text-[13px] font-medium text-[var(--primary)]">Zero</p>
      <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-[var(--foreground)] md:text-[32px]">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[var(--foreground-soft)] md:text-[15px] md:leading-7">
          {description}
        </p>
      ) : null}
    </section>
  );
}
