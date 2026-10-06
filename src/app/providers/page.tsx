"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { CheckCircle2, Copy, KeyRound, Save, Server, Settings2, X } from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);
type ProviderItem = { id: number; name: string; code: string; base_url: string; is_active: boolean; api_key_configured: boolean };
type Reference = { invoice_template: string; ref_id_template: string; tokens: string[] };
type FFZSettings = { configured: boolean; name: string; base_url: string; is_active: boolean; api_key_configured: boolean };

export default function ProvidersPage() {
  const { data: providers, mutate } = useSWR<ProviderItem[]>("/admin/providers", fetcher);
  const { data: refData, mutate: mutateReference } = useSWR<Reference>("/admin/settings/transaction-reference", fetcher);
  const [reference, setReference] = useState<Reference>({ invoice_template: "", ref_id_template: "", tokens: [] });
  const [selected, setSelected] = useState<ProviderItem | null>(null);
  const [ffz, setFFZ] = useState<FFZSettings | null>(null);
  const [name, setName] = useState("FFZStore");
  const [baseURL, setBaseURL] = useState("https://api.ffzstore.com");
  const [apiKey, setAPIKey] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { if (refData) setReference(refData); }, [refData]);

  const saveReference = async () => {
    setSaving(true); setNotice("");
    try { const res = await api.put("/admin/settings/transaction-reference", reference); await mutateReference(res.data.data, false); setNotice("Format invoice dan ref ID global tersimpan."); }
    catch (error: any) { setNotice(error.response?.data?.message || "Gagal menyimpan format global."); }
    finally { setSaving(false); }
  };

  const openManage = async (item: ProviderItem) => {
    setSelected(item); setNotice(""); setFFZ(null); setAPIKey("");
    if (item.code !== "FFZSTORE") return;
    const res = await api.get("/admin/providers/ffzstore");
    const data: FFZSettings = res.data.data;
    setFFZ(data); setName(data.name); setBaseURL(data.base_url); setIsActive(data.is_active);
  };

  const saveFFZ = async () => {
    setSaving(true); setNotice("");
    try {
      await api.put("/admin/providers/ffzstore", { name, base_url: baseURL, api_key: apiKey, is_active: isActive });
      setAPIKey(""); await mutate(); setNotice("Konfigurasi FFZStore tersimpan.");
    } catch (error: any) { setNotice(error.response?.data?.message || "Gagal menyimpan FFZStore."); }
    finally { setSaving(false); }
  };

  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5"><div className="flex gap-3"><Server className="h-5 w-5 text-indigo-300" /><div><h1 className="text-xl font-bold text-white">Providers Center</h1><p className="mt-1 text-sm text-slate-300">Kelola provider dari satu tempat. Opsi Kelola dibuka sebagai popup tanpa berpindah halaman.</p></div></div></div>

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4"><div><h2 className="font-bold text-white">Format Invoice & Ref ID Global</h2><p className="mt-1 text-xs text-slate-400">Berlaku untuk seluruh provider dan transaksi baru; tidak disimpan per provider.</p></div><div className="grid gap-4 md:grid-cols-2"><label className="text-sm text-slate-200">Template Invoice<input value={reference.invoice_template} onChange={(e) => setReference({ ...reference, invoice_template: e.target.value })} placeholder="INV-{date}-{random}" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm" /></label><label className="text-sm text-slate-200">Template Ref ID<input value={reference.ref_id_template} onChange={(e) => setReference({ ...reference, ref_id_template: e.target.value })} placeholder="REF-{timestamp}-{random}" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm" /></label></div><div className="flex flex-wrap gap-2 text-xs">{reference.tokens.map((token) => <button key={token} type="button" onClick={() => navigator.clipboard.writeText(token)} className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-slate-300 hover:border-indigo-500"><Copy className="h-3 w-3" />{token}</button>)}</div><button onClick={saveReference} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />Simpan Format Global</button></section>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{providers?.map((item) => <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4"><div className="flex items-start justify-between"><div><h2 className="font-bold text-white">{item.name}</h2><p className="font-mono text-xs text-indigo-300">{item.code}</p></div><span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${item.is_active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-slate-700 bg-slate-800 text-slate-400"}`}>{item.is_active ? "AKTIF" : "NONAKTIF"}</span></div><p className="text-xs text-slate-400">Credential: <span className={item.api_key_configured ? "text-emerald-400" : "text-amber-400"}>{item.api_key_configured ? "terkonfigurasi" : "belum diisi"}</span></p><button onClick={() => openManage(item)} className="inline-flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"><Settings2 className="h-3.5 w-3.5" />Kelola</button></div>)}</div>

    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"><div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4"><div className="flex items-start justify-between"><div><h2 className="font-bold text-white">Kelola {selected.name}</h2><p className="font-mono text-xs text-indigo-300">{selected.code}</p></div><button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><X /></button></div>{selected.code === "FFZSTORE" ? <><label className="block text-sm text-slate-200">Nama Provider<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5" /></label><label className="block text-sm text-slate-200">Base URL<input type="url" value={baseURL} onChange={(e) => setBaseURL(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm" /></label><label className="block text-sm text-slate-200">API Key {ffz?.api_key_configured && <span className="text-emerald-400">(sudah tersimpan)</span>}<div className="relative mt-1.5"><KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input type="password" value={apiKey} onChange={(e) => setAPIKey(e.target.value)} placeholder={ffz?.api_key_configured ? "Kosongkan untuk mempertahankan API key" : "Masukkan API key FFZStore"} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3" /></div></label><label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />Aktifkan FFZStore</label><button onClick={saveFFZ} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />Simpan FFZStore</button></> : <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300"><p>Status: <b>{selected.is_active ? "aktif" : "nonaktif"}</b></p><p className="mt-2">Provider ini terdaftar dan dapat dipilih dari Nominal sesuai statusnya. Konfigurasi khusus yang sudah ada tetap berjalan tanpa mengarahkan Anda ke halaman lain.</p></div>}{notice && <p className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="h-4 w-4" />{notice}</p>}</div></div>}
  </div>;
}
