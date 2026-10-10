"use client";

import { useState, useEffect } from "react";
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
  Code2,
  Copy,
  Check,
  Server,
  Zap,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";
import PromptModal from "@/components/PromptModal";
import Pagination from "@/components/Pagination";

const paginatedFetcher = (url: string) => api.get(url).then((res) => res.data);
const PUBLIC_CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  // Response Provider Modal State
  const [responseModal, setResponseModal] = useState<{
    isOpen: boolean;
    tx: any | null;
    copied: boolean;
  }>({
    isOpen: false,
    tx: null,
    copied: false,
  });

  // Dialog States
  const [retryModal, setRetryModal] = useState<{
    isOpen: boolean;
    txId: number | null;
    invoice: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    txId: null,
    invoice: "",
    isLoading: false,
  });

  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    txId: number | null;
    invoice: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    txId: null,
    invoice: "",
    isLoading: false,
  });

  const [refundModal, setRefundModal] = useState<{
    isOpen: boolean;
    txId: number | null;
    invoice: string;
    customerName: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    txId: null,
    invoice: "",
    customerName: "",
    isLoading: false,
  });

  const [checkingStatusTxId, setCheckingStatusTxId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkModal, setBulkModal] = useState<{ isOpen: boolean; action: "retry" | "success" | "fail" | null; notes: string; isLoading: boolean }>({ isOpen: false, action: null, notes: "", isLoading: false });
  const [bulkResult, setBulkResult] = useState<any | null>(null);

  useEffect(() => { setSelectedIds([]); }, [page, limit, statusFilter, search]);

  const { data: resData, mutate, isLoading } = useSWR(
    `/admin/transactions?page=${page}&limit=${limit}&status=${statusFilter}&search=${search}`,
    paginatedFetcher,
    { refreshInterval: 10000 }
  );

  const transactions = Array.isArray(resData?.data) ? resData.data : [];
  const totalItems = resData?.meta?.total ?? transactions.length;

  const selectableTxs = transactions.filter((tx: any) => tx.status === "processing");
  const allSelected = selectableTxs.length > 0 && selectableTxs.every((tx: any) => selectedIds.includes(tx.id));
  const toggleOne = (id: number) => setSelectedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleAll = () => setSelectedIds(allSelected ? [] : selectableTxs.map((tx: any) => tx.id));
  const openBulk = (action: "retry" | "success" | "fail") => setBulkModal({ isOpen: true, action, notes: "", isLoading: false });

  const executeBulk = async () => {
    if (!bulkModal.action || selectedIds.length === 0) return;
    setBulkModal((p) => ({ ...p, isLoading: true }));
    try {
      const res = await api.post("/admin/transactions/bulk", { action: bulkModal.action, ids: selectedIds, notes: bulkModal.notes });
      setBulkResult(res.data?.data);
      setBulkModal({ isOpen: false, action: null, notes: "", isLoading: false });
      setSelectedIds([]);
      mutate();
    } catch (err: any) {
      setBulkModal((p) => ({ ...p, isLoading: false }));
      alert("Gagal menjalankan aksi massal: " + (err.response?.data?.message || err.message));
    }
  };

  // Retry hanya untuk transaksi yang belum mencapai hasil final. Ini mencegah
  // order provider yang sudah gagal/refund diproses ulang tanpa keputusan baru.
  const canRetryTransaction = (status?: string) =>
    status === "pending" || status === "processing";

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const calculateSpeed = (tx: any) => {
    if (!tx) return "00.00.00.00";
    const startTime = new Date(tx.payment_verified_at || tx.created_at).getTime();
    const endTime = tx.completed_at
      ? new Date(tx.completed_at).getTime()
      : tx.status === "success" || tx.status === "failed" || tx.status === "refunded"
      ? new Date(tx.updated_at).getTime()
      : (tx.status === "processing" || tx.status === "pending" ? Date.now() : null);

    if (!startTime || !endTime || endTime < startTime) {
      return "00.00.00.00";
    }

    const diffMs = Math.max(0, endTime - startTime);
    const totalSeconds = Math.floor(diffMs / 1000);
    const ms = Math.floor((diffMs % 1000) / 10); // 2-digit ms (00-99)
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(hours)}.${pad(minutes)}.${pad(seconds)}.${pad(ms)}`;
  };

  const getProviderName = (tx: any) => {
    return (
      tx?.provider?.name ||
      tx?.nominal?.provider?.name ||
      (tx?.provider_id === 2 ? "Kiosgamer" : tx?.provider_id === 3 ? "FFZStore" : "Digiflazz")
    );
  };

  const providerExchange = (tx: any) => {
    const fallbackRequest = {
      provider: getProviderName(tx),
      action: "purchase",
      ref_id: tx?.ref_id || "-",
      customer_no: tx?.customer_id + (tx?.server_id ? `(${tx.server_id})` : ""),
      product_code: tx?.nominal?.provider_product_code || "-",
    };
    if (!tx?.provider_callback_data) return { request: fallbackRequest, response: null };
    try {
      const parsed = JSON.parse(tx.provider_callback_data);
      if (parsed && (parsed.request || parsed.response)) return { request: parsed.request || fallbackRequest, response: parsed.response || null };
      return { request: fallbackRequest, response: parsed };
    } catch {
      return { request: fallbackRequest, response: tx.provider_callback_data };
    }
  };

  const formatJSONResponse = (tx: any) => {
    if (!tx) return "{}";
    const exchange = providerExchange(tx);
    if (exchange.response) return typeof exchange.response === "string" ? exchange.response : JSON.stringify(exchange.response, null, 2);
    // Fallback constructed provider metadata
    const fallback = {
      provider: getProviderName(tx),
      ref_id: tx.ref_id || "-",
      provider_status: tx.provider_status || "Pending",
      provider_message: tx.provider_message || "Menunggu notifikasi webhook provider",
      serial_number: tx.payment_reference || "-",
      provider_order_id: tx.provider_order_id || "-",
      customer_no: tx.customer_id + (tx.server_id ? `(${tx.server_id})` : ""),
      buyer_sku_code: tx.nominal?.provider_product_code || "-",
      last_updated: tx.updated_at,
    };
    return JSON.stringify(fallback, null, 2);
  };

  const formatJSONRequest = (tx: any) => JSON.stringify(providerExchange(tx).request, null, 2);

  const copyResponseJSON = (tx: any) => {
    const formatted = formatJSONResponse(tx);
    navigator.clipboard.writeText(formatted);
    setResponseModal((prev) => ({ ...prev, copied: true }));
    setTimeout(() => {
      setResponseModal((prev) => ({ ...prev, copied: false }));
    }, 2000);
  };

  const handleCheckStatus = async (tx: any) => {
    if (!tx?.id) return;
    setCheckingStatusTxId(tx.id);
    try {
      const res = await api.post(`/admin/transactions/${tx.id}/check-status`);
      const updated = res.data?.data;
      alert(`Status provider berhasil diperbarui!\n\nStatus: ${updated?.status?.toUpperCase() || "OK"}\nStatus Provider: ${updated?.provider_status || "-"}\nPesan: ${updated?.provider_message || "-"}\nSN/ID: ${updated?.payment_reference || updated?.provider_order_id || "-"}`);
      mutate();
      if (selectedTx && selectedTx.id === tx.id) {
        setSelectedTx(updated);
      }
      if (responseModal.isOpen && responseModal.tx?.id === tx.id) {
        setResponseModal((prev) => ({ ...prev, tx: updated }));
      }
    } catch (err: any) {
      alert("Gagal cek status provider: " + (err.response?.data?.message || err.message));
    } finally {
      setCheckingStatusTxId(null);
    }
  };

  const handleRetryPrompt = (tx: any) => {
    setRetryModal({
      isOpen: true,
      txId: tx.id,
      invoice: tx.invoice_number,
      isLoading: false,
    });
  };

  const executeRetry = async () => {
    if (!retryModal.txId) return;
    setRetryModal((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.post(`/admin/transactions/${retryModal.txId}/retry`);
      setRetryModal({ isOpen: false, txId: null, invoice: "", isLoading: false });
      mutate();
      if (selectedTx) setSelectedTx(null);
    } catch (err: any) {
      setRetryModal((prev) => ({ ...prev, isLoading: false }));
      alert("Gagal retry: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSuccessPrompt = (tx: any) => {
    setSuccessModal({
      isOpen: true,
      txId: tx.id,
      invoice: tx.invoice_number,
      isLoading: false,
    });
  };

  const executeSuccess = async (values: Record<string, string>) => {
    if (!successModal.txId) return;
    setSuccessModal((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.post(`/admin/transactions/${successModal.txId}/success`, {
        sn: values.sn,
        notes: values.notes || "Sukses manual oleh admin",
      });
      setSuccessModal({ isOpen: false, txId: null, invoice: "", isLoading: false });
      mutate();
      if (selectedTx) setSelectedTx(null);
    } catch (err: any) {
      setSuccessModal((prev) => ({ ...prev, isLoading: false }));
      alert("Gagal update status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRefundPrompt = (tx: any) => {
    setRefundModal({
      isOpen: true,
      txId: tx.id,
      invoice: tx.invoice_number,
      customerName: tx.customer_id,
      isLoading: false,
    });
  };

  const executeRefund = async (values: Record<string, string>) => {
    if (!refundModal.txId) return;
    setRefundModal((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.post(`/admin/transactions/${refundModal.txId}/refund`, {
        notes: values.notes || "Refund transaksi gagal provider",
      });
      setRefundModal({ isOpen: false, txId: null, invoice: "", customerName: "", isLoading: false });
      mutate();
      if (selectedTx) setSelectedTx(null);
    } catch (err: any) {
      setRefundModal((prev) => ({ ...prev, isLoading: false }));
      alert("Gagal refund: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Pusat Transaksi Top-Up</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring dan eksekusi transaksi pelanggan, H2H, serta respon realtime provider
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
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl px-4 py-3">
          <span className="text-xs text-indigo-200 font-semibold">{selectedIds.length} transaksi dipilih</span>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => openBulk("retry")} className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" />Rehit</button>
            <button onClick={() => openBulk("success")} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Set Sukses</button>
            <button onClick={() => openBulk("fail")} className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />Set Gagal</button>
            <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs">Batal Pilih</button>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3.5 pl-5 pr-2 w-8">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} disabled={selectableTxs.length === 0} className="accent-indigo-500" title="Pilih semua yang berstatus processing di halaman ini" />
              </th>
                <th className="py-3.5 px-5">Invoice & Waktu</th>
                <th className="py-3.5 px-4">Game & Nominal</th>
                <th className="py-3.5 px-4">Tujuan Akun</th>
                <th className="py-3.5 px-4">Total Bayar</th>
                <th className="py-3.5 px-4">Speed</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Response Provider</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions && transactions.length > 0 ? (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 pl-5 pr-2">
                      <input type="checkbox" checked={selectedIds.includes(tx.id)} onChange={() => toggleOne(tx.id)} disabled={tx.status !== "processing"} className="accent-indigo-500 disabled:opacity-30" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div>
                        <a
                          href={`${PUBLIC_CLIENT_URL}/invoice/${tx.invoice_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 group"
                          title="Buka halaman invoice publik"
                        >
                          <span>{tx.invoice_number}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <span className="text-[10px] text-slate-500 block">
                          {new Date(tx.created_at).toLocaleString("id-ID")}
                        </span>
                        {tx.sn && (
                          <span className="text-[10px] font-mono text-emerald-400 block truncate max-w-[160px]" title={tx.sn}>
                            SN: {tx.sn}
                          </span>
                        )}
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
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                        {tx.status === "success" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 shadow-sm">
                            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {calculateSpeed(tx)}
                          </span>
                        ) : tx.status === "processing" || tx.status === "pending" ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            <Clock className="w-3 h-3 animate-spin" />
                            {calculateSpeed(tx)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/60">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {calculateSpeed(tx)}
                          </span>
                        )}
                      </div>
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

                    {/* Response Provider Column */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setResponseModal({ isOpen: true, tx, copied: false })}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/25 text-[11px] font-medium transition-all shadow-sm group"
                        title="Klik untuk melihat Raw JSON Response Provider / Callback"
                      >
                        <Code2 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span>Response JSON</span>
                      </button>
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
                        {/* Tombol 1: Cek Status Provider (Hanya Get Status, Tidak Memotong Saldo) */}
                        <button
                          onClick={() => handleCheckStatus(tx)}
                          disabled={checkingStatusTxId === tx.id}
                          className="p-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 transition-colors disabled:opacity-50"
                          title="Cek Status ke Provider (Get Status saja, TIDAK memotong saldo)"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${checkingStatusTxId === tx.id ? "animate-spin" : ""}`} />
                        </button>
                        {tx.status !== "success" && (
                          <>
                            {/* Tombol 2: Proses Ulang (Kirim Order Baru) */}
                            {canRetryTransaction(tx.status) && (
                              <button
                                onClick={() => handleRetryPrompt(tx)}
                                className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 transition-colors"
                                title="Proses Ulang (Kirim Order Baru ke Provider)"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleSuccessPrompt(tx)}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition-colors"
                              title="Set Sukses Manual"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRefundPrompt(tx)}
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
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    {isLoading ? "Memuat transaksi..." : "Tidak ada data transaksi."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination */}
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          isLoading={isLoading}
        />
      </div>

      {/* Response Provider JSON Modal */}
      {responseModal.isOpen && responseModal.tx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Request & Response Provider
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                      {getProviderName(responseModal.tx)}
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {responseModal.tx.invoice_number}
                    </span>
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      RefID: {responseModal.tx.ref_id || "-"}
                    </span>
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      Provider: <span className="text-amber-300 font-bold">{getProviderName(responseModal.tx)}</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setResponseModal({ isOpen: false, tx: null, copied: false })}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Nama Provider:</span>
                <span className="font-bold text-xs text-indigo-300 truncate block">
                  {getProviderName(responseModal.tx)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Status Provider:</span>
                <span
                  className={`font-bold font-mono text-xs ${
                    responseModal.tx.provider_status === "Sukses" || responseModal.tx.status === "success"
                      ? "text-emerald-400"
                      : responseModal.tx.provider_status === "Gagal" || responseModal.tx.status === "failed"
                      ? "text-rose-400"
                      : "text-amber-400"
                  }`}
                >
                  {responseModal.tx.provider_status || (responseModal.tx.status === "success" ? "Sukses" : "Pending")}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Serial Number (SN):</span>
                <span
                  className="font-mono text-xs text-emerald-300 truncate block"
                  title={responseModal.tx.sn || responseModal.tx.payment_reference}
                >
                  {responseModal.tx.sn || responseModal.tx.payment_reference || "-"}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Item / SKU:</span>
                <span className="font-semibold text-xs text-slate-200 truncate block">
                  {responseModal.tx.nominal?.name || "-"}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Tujuan Akun:</span>
                <span className="font-mono text-xs text-emerald-400 truncate block">
                  {responseModal.tx.customer_id}
                  {responseModal.tx.server_id ? ` (${responseModal.tx.server_id})` : ""}
                </span>
              </div>
            </div>

            {/* Request / Response audit container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Request Provider (credential/signature disensor):
                </span>
                <button
                  onClick={() => copyResponseJSON(responseModal.tx)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors shadow-sm"
                >
                  {responseModal.copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <pre className="p-4 text-xs font-mono text-sky-300 overflow-x-auto max-h-52 leading-relaxed selection:bg-indigo-500 selection:text-white">
                  {formatJSONRequest(responseModal.tx)}
                </pre>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  Response Provider (Callback / API):
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-52 leading-relaxed selection:bg-indigo-500 selection:text-white">
                  {formatJSONResponse(responseModal.tx)}
                </pre>
              </div>
            </div>

            {/* Footer Note & Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-500">
                Request dan respons terakhir disimpan otomatis tanpa credential provider.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCheckStatus(responseModal.tx)}
                  disabled={checkingStatusTxId === responseModal.tx.id}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  title="Hanya get status dari provider, TIDAK memotong saldo"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingStatusTxId === responseModal.tx.id ? "animate-spin" : ""}`} />
                  Cek Status Provider
                </button>
                {responseModal.tx.status !== "success" && (
                  <button
                    onClick={() => {
                      const tx = responseModal.tx;
                      setResponseModal({ isOpen: false, tx: null, copied: false });
                      handleRetryPrompt(tx);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Proses Ulang Order
                  </button>
                )}
                <button
                  onClick={() => setResponseModal({ isOpen: false, tx: null, copied: false })}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Detail Transaksi</h3>
                <a
                  href={`${PUBLIC_CLIENT_URL}/invoice/${selectedTx.invoice_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-indigo-400 font-bold hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
                  title="Buka invoice publik"
                >
                  {selectedTx.invoice_number}
                  <ExternalLink className="w-3 h-3" />
                </a>
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
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 block">Status Provider:</span>
                  <span className="text-[11px] text-indigo-300 font-mono font-bold flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {calculateSpeed(selectedTx)}
                  </span>
                </div>
                <span className="font-semibold text-amber-300 block">
                  {selectedTx.provider_status || "Pending"}
                </span>
                {(selectedTx.sn || selectedTx.payment_reference) && (
                  <div className="mt-1 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 block font-bold mb-0.5">Serial Number (SN):</span>
                    <span className="font-mono text-xs text-emerald-300 break-all block">
                      {selectedTx.sn || selectedTx.payment_reference}
                    </span>
                  </div>
                )}
                <span className="text-slate-500 block truncate">
                  Pesan: {selectedTx.provider_message || "-"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleCheckStatus(selectedTx)}
                disabled={checkingStatusTxId === selectedTx.id}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 border border-sky-500/30"
                title="Hanya mengambil status terbaru dari provider tanpa memotong saldo"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${checkingStatusTxId === selectedTx.id ? "animate-spin" : ""}`} />
                Cek Status Provider
              </button>

              <button
                onClick={() => {
                  const tx = selectedTx;
                  setSelectedTx(null);
                  setResponseModal({ isOpen: true, tx, copied: false });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                Lihat Response JSON
              </button>

              {selectedTx.status !== "success" && (
                <>
                  {canRetryTransaction(selectedTx.status) && (
                    <button
                      onClick={() => handleRetryPrompt(selectedTx)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      Proses Ulang Order
                    </button>
                  )}
                  <button
                    onClick={() => handleSuccessPrompt(selectedTx)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Set Sukses Manual
                  </button>
                  <button
                    onClick={() => handleRefundPrompt(selectedTx)}
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

      {bulkModal.isOpen && bulkModal.action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              {bulkModal.action === "retry" ? "Rehit" : bulkModal.action === "success" ? "Set Sukses Manual" : "Set Gagal Manual"} ({selectedIds.length} transaksi)
            </h3>
            <p className="text-xs text-amber-300 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 leading-relaxed">
              {bulkModal.action === "retry" && "Rehit hanya mengirim ulang jika pesanan belum pernah sampai ke provider. Jika sudah ada order di provider, sistem hanya mengecek statusnya."}
              {bulkModal.action === "success" && "SN dibuat otomatis: (nickname/ID). RefId : (invoice). Pastikan barang benar-benar sudah terkirim."}
              {bulkModal.action === "fail" && "Saldo dikembalikan otomatis hanya untuk pembayaran SALDO. Pembayaran non-saldo (Tripay) TIDAK dikembalikan otomatis. Jalankan Cek Status Provider dulu agar tidak menggagalkan transaksi yang sebenarnya sukses."}
            </p>
            {bulkModal.action !== "retry" && (
              <input value={bulkModal.notes} onChange={(e) => setBulkModal((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Catatan admin (opsional)" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200" />
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setBulkModal({ isOpen: false, action: null, notes: "", isLoading: false })} className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs">Batal</button>
              <button onClick={executeBulk} disabled={bulkModal.isLoading} className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50">
                {bulkModal.isLoading ? "Memproses..." : "Jalankan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-3">
            <h3 className="text-base font-bold text-white">Hasil Aksi Massal: {bulkResult.succeeded} berhasil, {bulkResult.failed} gagal/dilewati</h3>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800 text-xs">
              {bulkResult.results?.map((r: any) => (
                <div key={r.id} className="py-2 flex items-start gap-2">
                  <span className={r.success ? "text-emerald-400" : "text-rose-400"}>{r.success ? "✓" : "✗"}</span>
                  <div><span className="font-mono text-slate-200">{r.invoice_number || `#${r.id}`}</span>
                    <span className="text-slate-400 block">{r.message}</span></div>
                </div>
              ))}
            </div>
            <div className="flex justify-end"><button onClick={() => setBulkResult(null)} className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs">Tutup</button></div>
          </div>
        </div>
      )}

      {/* Confirmation Modal - Retry Provider */}
      <ConfirmModal
        isOpen={retryModal.isOpen}
        onClose={() =>
          setRetryModal({ isOpen: false, txId: null, invoice: "", isLoading: false })
        }
        onConfirm={executeRetry}
        title="Proses Ulang Transaksi (Kirim Order Baru)?"
        message={
          <div className="space-y-2.5">
            <p className="text-slate-200 text-xs leading-relaxed">
              Apakah Anda yakin ingin <strong>mengirimkan pesanan baru</strong> untuk invoice{" "}
              <strong className="text-white font-mono">{retryModal.invoice}</strong> ke provider?
            </p>
            <p className="text-amber-300 text-xs p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 leading-relaxed">
              ⚠️ <strong>PENTING:</strong> Tombol ini akan menembak transaksi baru dan <strong>dapat memotong saldo provider lagi</strong>. Jika saldo/shell Anda sudah terpotong di Kiosgamer sebelumnya, silakan <strong>Batal</strong> dan gunakan tombol <strong>"Cek Status Provider"</strong> (ikon refresh biru) agar saldo tidak terpotong ganda.
            </p>
          </div>
        }
        confirmText="Ya, Kirim Ulang Order"
        cancelText="Batal"
        variant="primary"
        isLoading={retryModal.isLoading}
      />

      {/* Prompt Modal - Manual Success */}
      <PromptModal
        isOpen={successModal.isOpen}
        onClose={() =>
          setSuccessModal({ isOpen: false, txId: null, invoice: "", isLoading: false })
        }
        onSubmit={executeSuccess}
        title="Ubah Status ke Sukses Manual"
        description={`Masukkan nomor Serial Number (SN) / bukti pengiriman untuk invoice ${successModal.invoice}`}
        fields={[
          {
            name: "sn",
            label: "Serial Number (SN) / Kode Voucher",
            placeholder: "Kosongkan = otomatis (nickname/ID. RefId : invoice)",
            required: false,
          },
          {
            name: "notes",
            label: "Catatan Admin (Opsional)",
            placeholder: "Sukses manual oleh admin",
            defaultValue: "Sukses manual oleh admin",
          },
        ]}
        confirmText="Setujui & Set Sukses"
        cancelText="Batal"
        variant="success"
        isLoading={successModal.isLoading}
      />

      {/* Prompt Modal - Refund */}
      <PromptModal
        isOpen={refundModal.isOpen}
        onClose={() =>
          setRefundModal({ isOpen: false, txId: null, invoice: "", customerName: "", isLoading: false })
        }
        onSubmit={executeRefund}
        title="Refund Saldo Pelanggan"
        description={`Saldo akan dikembalikan ke akun pelanggan untuk invoice ${refundModal.invoice}`}
        fields={[
          {
            name: "notes",
            label: "Alasan Refund Saldo",
            placeholder: "Contoh: Gangguan provider / ID tujuan salah",
            defaultValue: "Refund transaksi gagal provider",
            required: true,
          },
        ]}
        confirmText="Konfirmasi Refund Saldo"
        cancelText="Batal"
        variant="warning"
        isLoading={refundModal.isLoading}
      />
    </div>
  );
}
