"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  Tags,
  Zap,
  ShieldCheck,
  Receipt,
  Users,
  Wallet,
  CreditCard,
  Settings,
  LogOut,
  ArrowRightLeft,
  Image,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { clearAuthSession } from "@/lib/auth";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Games Catalog", href: "/games", icon: Gamepad2 },
  { name: "Nominals & Prices", href: "/nominals", icon: Tags },
  { name: "Banner & Promo", href: "/banners", icon: Image },
  { name: "Berita & Artikel", href: "/articles", icon: Newspaper },
  { name: "Digiflazz Center", href: "/digiflazz", icon: Zap },
  { name: "IP Whitelist & Security", href: "/ip-whitelist", icon: ShieldCheck },
  { name: "Users & Resellers", href: "/users", icon: Users },
  { name: "Deposits", href: "/deposits", icon: Wallet },
  { name: "Payment Gateways", href: "/payment-methods", icon: CreditCard },
  { name: "API Docs (H2H)", href: "/docs", icon: BookOpen },
  { name: "Logs & Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on login page
  if (pathname === "/login") return null;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Brand header – IRXPlay */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
          <ArrowRightLeft className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base text-white leading-none">IRXPlay Admin</h1>
          <span className="text-[11px] text-indigo-400 font-medium">Golang Engine v2.0</span>
        </div>
      </div>


      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={clearAuthSession}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
