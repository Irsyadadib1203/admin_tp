"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const { data: transactions, mutate, isLoading } = useSWR(
    `/admin/transactions?page=${page}&limit=20&status=${statusFilter}&search=${search}`,
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

  const handleRetry = async (id: number) => {
    if (!confirm("Ulangi proses transaksi ini ke provider Digiflazz?")) return;
    try {
      await api.post(`/admin/transactions/${id}/retry`);
      alert("Permintaan retry telah dikirim!");
      mutate();
      if (selectedTx) setSelectedTx(null);
    } catch (err: any) {
      alert("Gagal retry: " + err.message);
    }
  };

  const handleSuccess = async (id: number) => {
    const sn = prompt("Masukkan Serial Number (SN) / Voucher / No. Bukti Sukses:", "");
    if (sn === null) return;
    const notes = prompt("Catatan admin (opsional):", "Sukses manual oleh admin");
    if (notes === null) return;
    try {
      await api.post(`/admin/transactions/${id}/success`, { sn, notes });
      alert("Transaksi berhasil diubah ke status Sukses!");
      mutate();
      if (selectedTx) setSelectedTx(null);
    } catch (err: any) {
      alert("Gagal update status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRefund = async (id: number) => {
    const notes = prompt("Alasan refund saldo pelanggan:", "Refund transaksi gagal provider");
    if (notes === null) return;
    try {
      await api.post(`/admin/transactions/${id}/refund`, { notes });
      alert("Transaksi berhasil di-refund dan saldo dikembalikan ke akun pelanggan!");
      mutate();
      if (selectedTx) setSelectedTx(null);
    } catch (err: any) {
      alert("Gagal refund: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Pusat Transaksi Top-Up</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring dan eksekusi transaksi pelanggan, H2H, dan status provider
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari invoice / user ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-52"
            />
          </div>

          <button
            onClick={() => mutate()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3.5 px-5">Invoice & Waktu</th>
                <th className="py-3.5 px-4">Game & Nominal</th>
                <th className="py-3.5 px-4">Tujuan Akun</th>
                <th className="py-3.5 px-4">Total Bayar</th>
                <th className="py-3.5 px-4">Laba (Margin)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions && transactions.length > 0 ? (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-5">
                      <div>
                        <span className="font-mono font-bold text-slate-200 block">
                          {tx.invoice_number}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(tx.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-white block">
                          {tx.game?.name || "-"}
                        </span>
                        <span className="text-slate-300">{tx.nominal?.name || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-slate-200 block">
                        {tx.customer_id}
                        {tx.server_id ? ` (${tx.server_id})` : ""}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {tx.nickname || tx.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {formatRupiah(tx.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">
                      {formatRupiah(tx.profit)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          tx.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : tx.status === "processing" || tx.status === "pending"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : tx.status === "refunded"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {tx.status !== "success" && (
                          <>
                            <button
                              onClick={() => handleRetry(tx.id)}
                              className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 transition-colors"
                              title="Retry ke Provider"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleSuccess(tx.id)}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition-colors"
                              title="Set Sukses Manual"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRefund(tx.id)}
                              className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 transition-colors"
                              title="Refund Saldo"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    {isLoading ? "Memuat transaksi..." : "Tidak ada data transaksi."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Detail Transaksi</h3>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {selectedTx.invoice_number}
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Game & Produk:</span>
                <span className="font-semibold text-white block text-sm">
                  {selectedTx.game?.name}
                </span>
                <span className="text-slate-300">{selectedTx.nominal?.name}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Tujuan Akun Pelanggan:</span>
                <span className="font-semibold text-emerald-400 block text-sm">
                  {selectedTx.customer_id}
                  {selectedTx.server_id ? ` (${selectedTx.server_id})` : ""}
                </span>
                <span className="text-slate-400">
                  Nickname: {selectedTx.nickname || "-"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Harga & Keuntungan:</span>
                <span className="text-slate-200 block">
                  Modal: {formatRupiah(selectedTx.base_price)}
                </span>
                <span className="text-white font-bold block">
                  Jual: {formatRupiah(selectedTx.selling_price)}
                </span>
                <span className="text-emerald-400 font-bold">
                  Laba: +{formatRupiah(selectedTx.profit)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Status Provider Digiflazz:</span>
                <span className="font-semibold text-amber-300 block">
                  {selectedTx.provider_status || "Pending"}
                </span>
                <span className="text-slate-400 block">
                  SN: {selectedTx.payment_reference || "-"}
                </span>
                <span className="text-slate-500 block truncate">
                  Pesan: {selectedTx.provider_message || "-"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              {selectedTx.status !== "success" && (
                <>
                  <button
                    onClick={() => handleRetry(selectedTx.id)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Retry Digiflazz
                  </button>
                  <button
                    onClick={() => handleSuccess(selectedTx.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Set Sukses Manual
                  </button>
                  <button
                    onClick={() => handleRefund(selectedTx.id)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                  >
                    Refund Saldo
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
