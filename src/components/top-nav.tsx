"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNavItems } from "@/lib/navigation";
import { isNavItemActive } from "@/lib/navigation-active.mjs";

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden flex-1 justify-center md:flex">
      <div className="inline-flex min-w-[520px] items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,252,250,0.96)_100%)] px-2 py-2 shadow-[0_16px_36px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] lg:min-w-[560px]">
        {mainNavItems.map((item) => {
          const active = isNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-full px-5 py-3 text-[15px] font-medium leading-none transition",
                active
                  ? "bg-[linear-gradient(180deg,var(--surface-muted)_0%,#e5f3ed_100%)] text-[var(--primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_rgba(19,111,99,0.08)]"
                  : "text-[var(--foreground-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
