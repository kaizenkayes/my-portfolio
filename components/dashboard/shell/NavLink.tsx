import Link from "next/link";
import { ComponentType } from "react";

// Lucide বা React Icons এর প্রপ্স টাইপ হ্যান্ডেল করার জন্য
interface IconProps {
  size?: string | number;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  exact: boolean;
  // ReactNode এর বদলে ComponentType ব্যবহার করতে হবে
  icon: ComponentType<IconProps>;
}

interface NavLinkProps {
  item: NavItem;
  pathname: string;
}

export function NavLink({ item, pathname }: NavLinkProps) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  // ১. আইকন কম্পোনেন্টটিকে একটি ক্যাপিটাল লেটার ভ্যারিয়েবলে অ্যাসাইন করো
  const IconComponent = item.icon;

  return (
    <Link
      href={item.href}
      className={`sidebar-link ${isActive ? "active" : ""}`}
    >
      {/* ২. এখন এটিকে সরাসরি কম্পোনেন্ট হিসেবে রেন্ডার করো এবং সাইজ/ক্লাস কন্ট্রোল করো */}
      {IconComponent && <IconComponent size={16} className="w-4 h-4" />}
      <span>{item.label}</span>
    </Link>
  );
}
