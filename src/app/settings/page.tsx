"use client";

import { useState } from "react";
import useSWR from "swr";
import { Settings, Shield, Server, RefreshCw, Eye } from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function SettingsPage() {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const { data: webhookLogs, mutate, isLoading } = useSWR(
    "/admin/webhooks/logs",
    fetcher
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Log Webhook & Pengaturan Sistem</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Audit trail riwayat webhook masuk (Digiflazz/Payment) dan keluar (H2H Partners)
        </p>
      </div>

      {/* System Status Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-slate-400 font-medium">Backend Engine</span>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
            <Server className="w-4 h-4" /> Go (Golang) v1.26.7
          </p>
          <p className="text-[11px] text-slate-500">Port 8080 • Gin Framework</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-slate-400 font-medium">Admin Interface</span>
          <p className="text-sm font-bold text-indigo-400">Next.js 14 (App Router)</p>
          <p className="text-[11px] text-slate-500">Port 3001 • Tailwind CSS</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-slate-400 font-medium">Security Guard</span>
          <p className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> IP Whitelist & JWT RBAC
          </p>
          <p className="text-[11px] text-slate-500">Proteksi Transaksi H2H Aktif</p>
        </div>
      </div>

      {/* Webhook Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Riwayat Log Webhook Realtime
            </h3>
            <p className="text-xs text-slate-400">
              Merekam setiap payload webhook yang diterima atau dikirimkan engine
            </p>
          </div>
          <button
            onClick={() => mutate()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Arah</th>
                <th className="py-3.5 px-4">Provider / Partner</th>
                <th className="py-3.5 px-4">Target URL</th>
                <th className="py-3.5 px-4">Status Code</th>
                <th className="py-3.5 px-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {webhookLogs && webhookLogs.length > 0 ? (
                webhookLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.direction === "incoming"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {log.direction}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {log.provider_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                      {log.url || "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-emerald-400 font-bold">
                        {log.status_code || 200}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Lihat Raw Payload"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    {isLoading ? "Memuat log..." : "Belum ada riwayat webhook."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                Payload Log: {selectedLog.provider_name}
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1.5 font-medium">
                Raw JSON Payload:
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-64">
                {selectedLog.payload || "(Kosong)"}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
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
