"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { DevAutoLogin } from "@/components/DevAutoLogin";
import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingNav } from "@/components/MarketingNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const marketing = pathname === "/" || pathname === "/pricing";
  const fullPage = pathname === "/demo";

  if (fullPage) {
    return <>{children}</>;
  }

  if (marketing) {
    return (
      <>
        <DevAutoLogin />
        <MarketingNav />
        {children}
        <MarketingFooter />
      </>
    );
  }

  return (
    <>
      <DevAutoLogin />
      <AppNav />
      <div className="app-main">{children}</div>
      <footer className="app-footer">
        <p>&copy; 2026 Profilo</p>
      </footer>
    </>
  );
}
