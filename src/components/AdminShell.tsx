"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getStoredUser } from "@/lib/auth";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("topup_admin_token")
        : null;
    const user = getStoredUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    setChecked(true);
  }, [isLoginPage, router]);

  // Halaman login: render polos, tanpa sidebar/header/padding admin panel.
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Halaman admin lain: tunggu pengecekan token selesai dulu sebelum render,
  // supaya dashboard tidak sempat "kelihatan" sebelum redirect ke /login.
  if (!checked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Memeriksa sesi login...</p>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col pl-0 md:pl-64 min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </>
  );
}
