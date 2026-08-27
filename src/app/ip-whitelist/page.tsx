"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Search,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function IPWhitelistPage() {
  const [activeTab, setActiveTab] = useState<"whitelist" | "logs" | "watchlist">("whitelist");
  const [searchIP, setSearchIP] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Form states
  const [newIP, setNewIP] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [blockIP, setBlockIP] = useState("");
  const [blockReason, setBlockReason] = useState("Spam / Percobaan akses ilegal");
  const [blockHours, setBlockHours] = useState(24);

  // Data fetching
  const { data: whitelists, mutate: refreshWhitelists } = useSWR(
    "/admin/ip-whitelist",
    fetcher
  );
  const { data: accessLogs, mutate: refreshLogs } = useSWR(
    `/admin/ip-logs?ip=${searchIP}`,
    fetcher
  );
  const { data: watchlist, mutate: refreshWatchlist } = useSWR(
    "/admin/watchlist",
    fetcher
  );

  const handleAddWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/ip-whitelist", {
        ip_address: newIP,
        label: newLabel,
      });
      setIsAddModalOpen(false);
      setNewIP("");
      setNewLabel("");
      refreshWhitelists();
    } catch (err: any) {
      alert("Gagal menambahkan IP: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteWhitelist = async (id: number, ip: string) => {
    if (!confirm(`Hapus IP ${ip} dari daftar whitelist?`)) return;
    try {
      await api.delete(`/admin/ip-whitelist/${id}`);
      refreshWhitelists();
    } catch (err: any) {
      alert("Gagal menghapus IP: " + err.message);
    }
  };

  const handleBlockIP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/watchlist/block", {
        ip_address: blockIP,
        reason: blockReason,
        hours: blockHours,
      });
      setIsBlockModalOpen(false);
      setBlockIP("");
      refreshWatchlist();
      refreshLogs();
    } catch (err: any) {
      alert("Gagal memblokir IP: " + err.message);
    }
  };

  const handleUnblockIP = async (ip: string) => {
    if (!confirm(`Buka blokir untuk IP ${ip}?`)) return;
    try {
      await api.post("/admin/watchlist/unblock", { ip_address: ip });
      refreshWatchlist();
      refreshLogs();
    } catch (err: any) {
      alert("Gagal membuka blokir: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            Sistem IP Whitelist & Watchlist Keamanan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kontrol ketat alamat IP yang diizinkan melakukan transaksi H2H ke website Anda
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("whitelist")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "whitelist"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            IP Whitelist Diizinkan
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "watchlist"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Watchlist & Blokir
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "logs"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Log Akses IP
          </button>
        </div>
      </div>

      {/* Content based on Tab */}
      {activeTab === "whitelist" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Menampilkan IP address yang memiliki izin mengeksekusi API H2H Seller.
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Tambah IP Whitelist
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                  <th className="py-3.5 px-5">IP Address</th>
                  <th className="py-3.5 px-4">Label / Keterangan</th>
                  <th className="py-3.5 px-4">Mitra Pemilik</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {whitelists && whitelists.length > 0 ? (
                  whitelists.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-semibold text-emerald-400">
                        {item.ip_address}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">{item.label || "-"}</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {item.user?.name || "Global Whitelist (Semua Mitra)"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Diizinkan
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDeleteWhitelist(item.id, item.ip_address)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Hapus IP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      Belum ada IP yang terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "watchlist" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              IP yang terdeteksi mencurigakan atau diblokir dari sistem transaksi.
            </span>
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20"
            >
              <Lock className="w-4 h-4" />
              Blokir IP Manual
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                  <th className="py-3.5 px-5">IP Address</th>
                  <th className="py-3.5 px-4">Jumlah Percobaan Gagal</th>
                  <th className="py-3.5 px-4">Alasan Blokir</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {watchlist && watchlist.length > 0 ? (
                  watchlist.map((w: any) => (
                    <tr key={w.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-semibold text-rose-400">
                        {w.ip_address}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-amber-400 font-bold">
                          {w.failed_attempts}x
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{w.block_reason || "-"}</td>
                      <td className="py-3.5 px-4">
                        {w.is_blocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <Lock className="w-3 h-3" /> DIBLOKIR
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" /> Dalam Pengawasan
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {w.is_blocked && (
                          <button
                            onClick={() => handleUnblockIP(w.ip_address)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Unlock className="w-3 h-3" /> Buka Blokir
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      Tidak ada IP mencurigakan dalam watchlist.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari log per IP..."
                value={searchIP}
                onChange={(e) => setSearchIP(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                  <th className="py-3.5 px-5">Waktu</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4">Endpoint</th>
                  <th className="py-3.5 px-4">Status & Alasan</th>
                  <th className="py-3.5 px-4">User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {accessLogs && accessLogs.length > 0 ? (
                  accessLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-5 text-slate-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                        {log.ip_address}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-indigo-300">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 mr-1.5 text-[10px] text-slate-300">
                          {log.method}
                        </span>
                        {log.endpoint}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold mr-1.5 ${
                            log.status === "ALLOWED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {log.status}
                        </span>
                        <span className="text-slate-400">{log.reason}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 truncate max-w-xs">
                        {log.user_agent}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">
                      Belum ada log akses.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Whitelist */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Tambah IP Whitelist</h3>
            <form onSubmit={handleAddWhitelist} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Alamat IP (IPv4 / IPv6) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 103.150.22.45 atau 127.0.0.1"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Label / Nama Mitra
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Server Mitra Topupku Jakarta"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Simpan IP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Block IP Manual */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Blokir IP Address</h3>
            <form onSubmit={handleBlockIP} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Alamat IP yang Diblokir *
                </label>
                <input
                  type="text"
                  required
                  placeholder="103.xxx.xxx.xxx"
                  value={blockIP}
                  onChange={(e) => setBlockIP(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Alasan Pemblokiran
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Durasi Pemblokiran
                </label>
                <select
                  value={blockHours}
                  onChange={(e) => setBlockHours(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                >
                  <option value={1}>1 Jam</option>
                  <option value={24}>24 Jam (1 Hari)</option>
                  <option value={168}>7 Hari</option>
                  <option value={0}>Permanen</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-600/30"
                >
                  Blokir Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
