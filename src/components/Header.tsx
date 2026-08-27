"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ShieldAlert, User as UserIcon } from "lucide-react";
import { getStoredUser, AdminUser } from "@/lib/auth";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  if (pathname === "/login") return null;

  const pageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard Overview";
      case "/transactions":
        return "Transactions Center";
      case "/games":
        return "Games Catalog";
      case "/nominals":
        return "Nominals & Pricing";
      case "/digiflazz":
        return "Digiflazz Command Center";
      case "/ip-whitelist":
        return "IP Whitelist & Security Guard";
      case "/users":
        return "Users & Reseller Accounts";
      case "/deposits":
        return "Deposit Approvals";
      case "/payment-methods":
        return "Payment Gateways & Methods";
      case "/settings":
        return "System Logs & Settings";
      default:
        return "Admin Portal";
    }
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-semibold text-white">{pageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Engine Active
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">
              {user?.name || "Administrator"}
            </p>
            <span className="text-[10px] text-slate-400 uppercase font-medium">
              {user?.role || "SUPERADMIN"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
