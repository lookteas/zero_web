import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type PrimaryButtonVariant = "primary" | "secondary" | "ghost";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: PrimaryButtonVariant;
  block?: boolean;
};

type PrimaryButtonClassNameOptions = {
  variant?: PrimaryButtonVariant;
  block?: boolean;
  className?: string;
};

type PrimaryLinkButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children"> & {
    children: ReactNode;
    variant?: PrimaryButtonVariant;
    block?: boolean;
    className?: string;
  };

export function getPrimaryButtonClassName({
  variant = "primary",
  block = true,
  className,
}: PrimaryButtonClassNameOptions = {}) {
  const variantClassName = {
    primary:
      "bg-[linear-gradient(180deg,var(--primary)_0%,var(--primary-deep)_100%)] shadow-[0_12px_28px_rgba(19,111,99,0.22)] hover:brightness-[1.03]",
    secondary:
      "border border-[var(--border-strong)] bg-white/95 text-[var(--foreground)] shadow-[0_8px_20px_rgba(15,23,42,0.05)] hover:bg-[var(--surface-soft)]",
    ghost: "bg-transparent text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]",
  }[variant];

  return [
    "inline-flex min-h-[46px] items-center justify-center rounded-[18px] px-4 text-[14px] font-medium leading-5 transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-12 md:px-5 md:text-sm",
    block ? "w-full" : "w-auto",
    variantClassName,
    className ?? "",
  ].join(" ");
}

function getPrimaryButtonStyle(variant: PrimaryButtonVariant, style?: CSSProperties) {
  if (variant !== "primary") {
    return style;
  }

  return {
    color: "var(--primary-foreground)",
    ...style,
  };
}

export function PrimaryButton({
  children,
  variant = "primary",
  block = true,
  className,
  type = "button",
  style,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={getPrimaryButtonClassName({ variant, block, className })}
      style={getPrimaryButtonStyle(variant, style)}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryLinkButton({
  children,
  variant = "primary",
  block = true,
  className,
  style,
  ...props
}: PrimaryLinkButtonProps) {
  return (
    <Link
      {...props}
      className={getPrimaryButtonClassName({ variant, block, className })}
      style={getPrimaryButtonStyle(variant, style)}
    >
      {children}
    </Link>
  );
}
