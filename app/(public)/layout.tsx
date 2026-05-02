
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar/Navbar";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar></Navbar>
      <main>{children}</main>
      <Footer></Footer>
    </>
  );
}
