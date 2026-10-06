"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { AlertTriangle, CheckCircle2, KeyRound, Save, Server, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

type FFZStoreSettings = {
  configured: boolean;
  name: string;
  base_url: string;
  is_active: boolean;
  api_key_configured: boolean;
};

export default function FFZStorePage() {
  const { data, mutate, isLoading } = useSWR<FFZStoreSettings>("/admin/providers/ffzstore", fetcher);
  const [name, setName] = useState("FFZStore");
  const [baseURL, setBaseURL] = useState("https://api.ffzstore.com");
  const [apiKey, setAPIKey] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!data) return;
    setName(data.name || "FFZStore");
    setBaseURL(data.base_url || "https://api.ffzstore.com");
    setIsActive(data.is_active);
  }, [data]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const res = await api.put("/admin/providers/ffzstore", {
        name,
        base_url: baseURL,
        api_key: apiKey,
        is_active: isActive,
      });
      setAPIKey("");
      await mutate(res.data.data, false);
      setNotice({ type: "success", text: "Konfigurasi FFZStore tersimpan. Provider kini tersedia di halaman Nominal." });
    } catch (error: any) {
      setNotice({ type: "error", text: error.response?.data?.message || error.message || "Gagal menyimpan konfigurasi FFZStore." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5">
        <div className="flex items-start gap-3">
          <Server className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />
          <div>
            <h1 className="text-xl font-bold text-white">FFZStore OtoMax Center</h1>
            <p className="mt-1 text-sm text-slate-300">Konfigurasikan provider FFZStore sebelum memilihnya sebagai provider pemrosesan nominal.</p>
          </div>
        </div>
      </div>

      {notice && (
        <div className={`flex gap-2 rounded-xl border p-4 text-sm ${notice.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
          {notice.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
          {notice.text}
        </div>
      )}

      <form onSubmit={save} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-200">Nama Provider
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-indigo-500" />
          </label>
          <label className="block text-sm font-medium text-slate-200">Base URL
            <input type="url" value={baseURL} onChange={(e) => setBaseURL(e.target.value)} required placeholder="https://api.ffzstore.com" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm text-slate-100 outline-none focus:border-indigo-500" />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-200">API Key {data?.api_key_configured && <span className="text-emerald-400">(sudah tersimpan)</span>}
          <div className="relative mt-1.5">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input type="password" value={apiKey} onChange={(e) => setAPIKey(e.target.value)} placeholder={data?.api_key_configured ? "Kosongkan untuk mempertahankan API key" : "Masukkan API key FFZStore"} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-slate-100 outline-none focus:border-indigo-500" />
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-4">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-indigo-500" />
          <span><span className="block font-medium text-slate-100">Aktifkan FFZStore</span><span className="text-xs text-slate-400">Hanya aktifkan setelah API key dan SKU produk sudah diverifikasi.</span></span>
        </label>

        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100">
          <div className="mb-1 flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4" /> Keamanan callback</div>
          Dokumentasi FFZStore belum mendefinisikan signature callback. Batasi source IP callback pada Nginx/firewall sebelum provider dipakai di production. Timeout atau respons ambigu tetap diproses sebagai pending, tanpa pembelian ulang otomatis.
        </div>

        <button disabled={saving || isLoading} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
          <Save className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan Konfigurasi FFZStore"}
        </button>
      </form>
    </div>
  );
}
