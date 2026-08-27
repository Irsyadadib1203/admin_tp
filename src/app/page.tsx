"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  RefreshCw,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function DashboardPage() {
  const { data: stats, mutate: refreshStats, isLoading: statsLoading } = useSWR(
    "/admin/dashboard/stats",
    fetcher,
    { refreshInterval: 15000 }
  );

  const { data: recentTxs, mutate: refreshTxs } = useSWR(
    "/transactions/recent?limit=8",
    fetcher,
    { refreshInterval: 10000 }
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dashboard Performa
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pantau transaksi top-up game, integrasi Digiflazz H2H, dan statistik keuntungan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refreshStats();
              refreshTxs();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            Segarkan Data
          </button>
          <Link
            href="/digiflazz"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            Digiflazz Center
          </Link>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Pendapatan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-white">
              {statsLoading ? "Memuat..." : formatRupiah(stats?.total_revenue)}
            </h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <span>Hari ini: {formatRupiah(stats?.today_revenue)}</span>
            </p>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Laba Bersih (Margin)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-white">
              {statsLoading ? "Memuat..." : formatRupiah(stats?.total_profit)}
            </h3>
            <p className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1 font-medium">
              <span>Laba Hari ini: {formatRupiah(stats?.today_profit)}</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Transaksi</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-white">
              {statsLoading ? "0" : (stats?.total_orders || 0).toLocaleString()}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-medium">
                {stats?.success_orders || 0} Sukses
              </span>
              <span>•</span>
              <span className="text-amber-400">{stats?.pending_orders || 0} Proses</span>
            </div>
          </div>
        </div>

        {/* Digiflazz Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Saldo Digiflazz Provider</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-amber-300">
              {statsLoading ? "Memuat..." : formatRupiah(stats?.digiflazz_balance)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Digunakan untuk fulfillment otomatis
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/digiflazz"
          className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Digiflazz H2H Sync</h4>
              <p className="text-xs text-slate-400">Tarik katalog & atur markup harga</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </Link>

        <Link
          href="/ip-whitelist"
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">IP Whitelist Mitra</h4>
              <p className="text-xs text-slate-400">Kelola akses aman koneksi H2H</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <Link
          href="/deposits"
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-900/40 to-slate-900 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Persetujuan Deposit</h4>
              <p className="text-xs text-slate-400">Verifikasi saldo member & reseller</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
        </Link>
      </div>

      {/* Recent Live Transactions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white">
              Transaksi Terkini (Live Feed)
            </h3>
            <p className="text-xs text-slate-400">
              Transaksi top-up game yang baru saja diproses oleh engine
            </p>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Lihat Semua Transaksi &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium pb-3">
                <th className="pb-3 pr-4">Invoice</th>
                <th className="pb-3 px-4">Game</th>
                <th className="pb-3 px-4">Item / Nominal</th>
                <th className="pb-3 px-4">User ID Game</th>
                <th className="pb-3 px-4">Total</th>
                <th className="pb-3 px-4">Metode</th>
                <th className="pb-3 pl-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentTxs && recentTxs.length > 0 ? (
                recentTxs.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-medium text-slate-200">
                      {tx.invoice_number}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {tx.game_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{tx.nominal_name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {tx.customer_id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {formatRupiah(tx.total_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                        {tx.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          tx.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : tx.status === "processing" || tx.status === "pending"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {tx.status === "success" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {tx.status === "processing" && <Clock className="w-3 h-3" />}
                        {tx.status === "failed" && <XCircle className="w-3 h-3" />}
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Belum ada transaksi top-up terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
