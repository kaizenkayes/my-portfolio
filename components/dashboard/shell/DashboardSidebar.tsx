"use client";

import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import { useEffect } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { NavLink } from "./NavLink";
import { SidebarFooter } from "./SidebarFooter";
import { NAV_ITEMS } from "./navData";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="sidebar-overlay m-4 fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[99] md:hidden"
        />
      )}

      <aside
        className={`sidebar transition-transform duration-300  ease-in-out ${
          sidebarOpen ? "translate-x-0" : ""
        }`}
        style={{ transform: sidebarOpen ? "translateX(0)" : undefined }}
      >
        <SidebarHeader onClose={() => setSidebarOpen(false)} />

        <nav className="flex-1 py-4 overflow-y-auto flex flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <SidebarFooter />
      </aside>
    </>
  );
}
