import Link from "next/link";
import { ReactNode } from "react";

// NavItem এর জন্য একটি ইন্টারফেস তৈরি করা ভালো
interface NavItem {
  label: string;
  href: string;
  exact: boolean;
  icon: ReactNode; // যেহেতু আইকন একটি SVG বা এলিমেন্ট
}

interface NavLinkProps {
  item: NavItem;
  pathname: string;
}

export function NavLink({ item, pathname }: NavLinkProps) {
  // isActive লজিক এখন টাইপ-সেফ
  const isActive = item.exact 
    ? pathname === item.href 
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`sidebar-link ${isActive ? "active" : ""}`}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
}