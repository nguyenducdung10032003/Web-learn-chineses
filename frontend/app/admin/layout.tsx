import type React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      {/* Bạn có thể để Sidebar hoặc header riêng của Admin */}
      <main>{children}</main>
    </div>
  );
}
