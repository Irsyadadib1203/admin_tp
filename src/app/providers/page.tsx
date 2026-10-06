"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { CheckCircle2, Copy, ExternalLink, Save, Server, Settings2 } from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

type ProviderItem = { id: number; name: string; code: string; base_url: string; is_active: boolean; api_key_configured: boolean };
type Reference = { invoice_template: string; ref_id_template: string; tokens: string[] };

const routeFor = (code: string) => {
  if (code === "DIGIFLAZZ") return "/digiflazz";
  if (code === "KIOSGAMER") return "/kiosgamer";
  if (code === "FFZSTORE") return "/ffzstore";
  return null;
};

export default function ProvidersPage() {
  const { data: providers, mutate } = useSWR<ProviderItem[]>("/admin/providers", fetcher);
  const [selected, setSelected] = useState<ProviderItem | null>(null);
  const [reference, setReference] = useState<Reference>({ invoice_template: "", ref_id_template: "", tokens: [] });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const openReference = async (item: ProviderItem) => {
    setSelected(item); setNotice("");
    const res = await api.get(`/admin/providers/${item.id}/reference-settings`);
    setReference(res.data.data);
  };
  const saveReference = async () => {
    if (!selected) return;
    setSaving(true); setNotice("");
    try {
      await api.put(`/admin/providers/${selected.id}/reference-settings`, { invoice_template: reference.invoice_template, ref_id_template: reference.ref_id_template });
      setNotice("Format reference tersimpan. Berlaku untuk transaksi baru."); await mutate();
    } catch (error: any) { setNotice(error.response?.data?.message || "Gagal menyimpan format reference."); }
    finally { setSaving(false); }
  };

  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5"><div className="flex gap-3"><Server className="h-5 w-5 text-indigo-300" /><div><h1 className="text-xl font-bold text-white">Providers Center</h1><p className="mt-1 text-sm text-slate-300">Satu tempat untuk konfigurasi provider, credential, format invoice/ref ID, dan status integrasi.</p></div></div></div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {providers?.map((item) => { const route = routeFor(item.code); return <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4"><div className="flex items-start justify-between gap-2"><div><h2 className="font-bold text-white">{item.name}</h2><p className="font-mono text-xs text-indigo-300">{item.code}</p></div><span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${item.is_active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-slate-700 bg-slate-800 text-slate-400"}`}>{item.is_active ? "AKTIF" : "NONAKTIF"}</span></div><div className="text-xs text-slate-400">Credential: <span className={item.api_key_configured ? "text-emerald-400" : "text-amber-400"}>{item.api_key_configured ? "terkonfigurasi" : "belum diisi"}</span></div><div className="flex flex-wrap gap-2"><button onClick={() => openReference(item)} className="inline-flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"><Settings2 className="h-3.5 w-3.5" /> Format Ref</button>{route && <Link href={route} className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500">Kelola <ExternalLink className="h-3.5 w-3.5" /></Link>}</div></div>; })}
    </div>
    {selected && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4"><div className="flex justify-between gap-3"><div><h2 className="font-bold text-white">Format Invoice & Ref ID — {selected.name}</h2><p className="mt-1 text-xs text-slate-400">Setiap transaksi baru tetap diberi suffix acak jika template tidak memakai <code>{"{random}"}</code>.</p></div><button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">✕</button></div><div className="grid gap-4 md:grid-cols-2"><label className="text-sm text-slate-200">Template Invoice<input value={reference.invoice_template} onChange={(e) => setReference({ ...reference, invoice_template: e.target.value })} placeholder="INV-{date}-{random}" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm" /></label><label className="text-sm text-slate-200">Template Ref ID<input value={reference.ref_id_template} onChange={(e) => setReference({ ...reference, ref_id_template: e.target.value })} placeholder="REF-{timestamp}-{random}" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm" /></label></div><div className="flex flex-wrap gap-2 text-xs text-slate-400">{reference.tokens.map((token) => <button key={token} onClick={() => navigator.clipboard.writeText(token)} className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 font-mono hover:border-indigo-500"><Copy className="h-3 w-3" />{token}</button>)}</div>{notice && <p className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="h-4 w-4" />{notice}</p>}<button onClick={saveReference} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Menyimpan..." : "Simpan Format"}</button></div>}
  </div>;
}
