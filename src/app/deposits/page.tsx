"use client";

import { useState } from "react";
import useSWR from "swr";
import { Wallet, CheckCircle2, XCircle, Clock, Search, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function DepositsPage() {
  const [statusFilter, setStatusFilter] = useState("");

  const { data: deposits, mutate, isLoading } = useSWR(
    `/admin/deposits?status=${statusFilter}`,
    fetcher
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleApprove = async (id: number, userName: string, amount: number) => {
    if (
      !confirm(
        `Setujui deposit sebesar ${formatRupiah(amount)} untuk ${userName}? Saldo akun akan langsung ditambahkan secara otomatis.`
      )
    )
      return;

    try {
      await api.post(`/admin/deposits/${id}/approve`);
      alert("Deposit berhasil disetujui dan saldo telah ditambahkan!");
      mutate();
    } catch (err: any) {
      alert("Gagal menyetujui deposit: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id: number) => {
    const notes = prompt("Alasan penolakan deposit:", "Bukti transfer tidak valid");
    if (notes === null) return;

    try {
      await api.post(`/admin/deposits/${id}/reject`, { notes });
      alert("Permintaan deposit ditolak.");
      mutate();
    } catch (err: any) {
      alert("Gagal menolak deposit: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Persetujuan Deposit Saldo</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verifikasi dan setujui penambahan saldo member & reseller
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu Persetujuan (Pending)</option>
            <option value="approved">Disetujui (Approved)</option>
            <option value="rejected">Ditolak (Rejected)</option>
          </select>

          <button
            onClick={() => mutate()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
              <th className="py-3.5 px-5">Invoice & Waktu</th>
              <th className="py-3.5 px-4">Member / Reseller</th>
              <th className="py-3.5 px-4">Nominal Deposit</th>
              <th className="py-3.5 px-4">Kode Unik</th>
              <th className="py-3.5 px-4">Total Transfer</th>
              <th className="py-3.5 px-4">Metode</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {deposits && deposits.length > 0 ? (
              deposits.map((dep: any) => (
                <tr key={dep.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-5">
                    <div>
                      <span className="font-mono font-bold text-slate-200 block">
                        {dep.invoice_number}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(dep.created_at).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-white block">
                        {dep.user?.name || "User #" + dep.user_id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {dep.user?.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {formatRupiah(dep.amount)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">
                    +{dep.unique_code || 0}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    {formatRupiah(dep.total_amount)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{dep.payment_method}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        dep.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : dep.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {dep.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {dep.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleApprove(dep.id, dep.user?.name, dep.amount)
                          }
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Setujui
                        </button>
                        <button
                          onClick={() => handleReject(dep.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" /> Tolak
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Selesai</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500">
                  {isLoading ? "Memuat permintaan deposit..." : "Tidak ada deposit."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
