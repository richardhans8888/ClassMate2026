"use client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/session") ||
    pathname.startsWith("/chat") ||
    (pathname.startsWith("/groups/") && pathname !== "/groups");
  const hideHeader = false;
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0F172A]">
      {!hideHeader && <Header />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
