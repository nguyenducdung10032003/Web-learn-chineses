"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";

export function NavigationWrapper() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null;
  return <Navigation />;
}
