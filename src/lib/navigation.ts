export type NavItem = {
  href: string;
  label: string;
};

export const mainNavItems: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/today", label: "今日" },
  { href: "/logs", label: "觉察" },
  { href: "/reviews", label: "复盘" },
  { href: "/me", label: "我的" },
];
