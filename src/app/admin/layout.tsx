import React from "react";
import { getAdminSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Back-Office | Sumatera Explore",
  description: "Panel kontrol & CMS terintegrasi SUJAI TOBA SUMATERA.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminSession();
  return <AdminShell user={user}>{children}</AdminShell>;
}
