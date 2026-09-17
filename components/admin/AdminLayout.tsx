import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-[#050816]">

      <AdminSidebar />

      <div className="flex-1 flex flex-col">

        <AdminTopbar />

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}