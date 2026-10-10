"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  RefreshCw,
  Save,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

type ProviderItem = {
  id: number;
  name: string;
  code: string;
  base_url: string;
  is_active: boolean;
  api_key_configured: boolean;
  balance?: number;
  balance_unit?: string;
  balance_checked_at?: string | null;
};

type Reference = {
  invoice_template: string;
  ref_id_template: string;
  tokens: string[];
};

type FFZSettings = {
  configured: boolean;
  name: string;
  base_url: string;
  is_active: boolean;
  api_key_configured: boolean;
};

type DigiflazzSettings = {
  configured: boolean;
  id?: number;
  name: string;
  base_url: string;
  username: string;
  is_active: boolean;
  api_key_configured: boolean;
};

type KiosgamerStatus = {
  configured: boolean;
  status: string;
  username?: string;
  uid?: string;
  oauth_expiry_time?: number;
  has_totp_secret: boolean;
  last_checked_at?: string | null;
  last_recovered_at?: string | null;
};

export default function ProvidersPage() {
  const { data: providers, mutate } = useSWR<ProviderItem[]>("/admin/providers", fetcher);
  const { data: refData, mutate: mutateReference } = useSWR<Reference>(
    "/admin/settings/transaction-reference",
    fetcher
  );

  const [reference, setReference] = useState<Reference>({
    invoice_template: "",
    ref_id_template: "",
    tokens: [],
  });
  const [selected, setSelected] = useState<ProviderItem | null>(null);

  // Common Form States
  const [name, setName] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [apiKey, setAPIKey] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  // FFZStore State
  const [ffz, setFFZ] = useState<FFZSettings | null>(null);

  // Digiflazz State
  const [digi, setDigi] = useState<DigiflazzSettings | null>(null);
  const [digiUsername, setDigiUsername] = useState("");

  // Kiosgamer States
  const [kiosStatus, setKiosStatus] = useState<KiosgamerStatus | null>(null);
  const [kiosSessionKey, setKiosSessionKey] = useState("");
  const [kiosTotpSecret, setKiosTotpSecret] = useState("");
  const [showSessionKey, setShowSessionKey] = useState(false);
  const [showTotpSecret, setShowTotpSecret] = useState(false);
  const [isCheckingKios, setIsCheckingKios] = useState(false);
  const [isRecoveringKios, setIsRecoveringKios] = useState(false);

  // Per-card balance loading indicator
  const [checkingBalanceId, setCheckingBalanceId] = useState<number | null>(null);

  useEffect(() => {
    if (refData) setReference(refData);
  }, [refData]);

  const formatRupiah = (val?: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatBalance = (val?: number, unit?: string) => {
    if (unit?.toUpperCase() === "SHELL") {
      return `${(val || 0).toLocaleString("id-ID")} Shell`;
    }
    return formatRupiah(val);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatUnixExpiry = (expiryUnix?: number) => {
    if (!expiryUnix || expiryUnix <= 0) return "-";
    const date = new Date(expiryUnix * 1000);
    const now = new Date();
    const isExpired = date < now;
    return `${date.toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    })} ${isExpired ? "(Kadaluarsa)" : ""}`;
  };

  const refreshProviderBalance = async (id: number) => {
    setCheckingBalanceId(id);
    setNotice("");
    try {
      const res = await api.get(`/admin/providers/${id}/balance`);
      await mutate();
      setNotice(`Saldo ${res.data.data?.name || "provider"} berhasil diperbarui.`);
    } catch (err: any) {
      setNotice(err.response?.data?.message || "Gagal memperbarui saldo provider.");
    } finally {
      setCheckingBalanceId(null);
    }
  };

  const saveReference = async () => {
    setSaving(true);
    setNotice("");
    try {
      const res = await api.put("/admin/settings/transaction-reference", reference);
      await mutateReference(res.data.data, false);
      setNotice("Format invoice dan ref ID global tersimpan.");
    } catch (error: any) {
      setNotice(error.response?.data?.message || "Gagal menyimpan format global.");
    } finally {
      setSaving(false);
    }
  };

  const openManage = async (item: ProviderItem) => {
    setSelected(item);
    setNotice("");
    setAPIKey("");
    setName(item.name);
    setBaseURL(item.base_url);
    setIsActive(item.is_active);

    const code = item.code.toUpperCase();
    if (code === "FFZSTORE") {
      try {
        const res = await api.get("/admin/providers/ffzstore");
        const data: FFZSettings = res.data.data;
        setFFZ(data);
        setName(data.name);
        setBaseURL(data.base_url);
        setIsActive(data.is_active);
      } catch {
        // fallback
      }
    } else if (code === "DIGIFLAZZ") {
      try {
        const res = await api.get("/admin/providers/digiflazz");
        const data: DigiflazzSettings = res.data.data;
        setDigi(data);
        setName(data.name);
        setBaseURL(data.base_url);
        setDigiUsername(data.username || "");
        setIsActive(data.is_active);
      } catch {
        // fallback
      }
    } else if (code === "KIOSGAMER") {
      try {
        const res = await api.get("/admin/kiosgamer/status");
        setKiosStatus(res.data.data);
      } catch {
        // fallback
      }
      setKiosSessionKey("");
      setKiosTotpSecret("");
      setShowSessionKey(false);
      setShowTotpSecret(false);
    }
  };

  const saveFFZ = async () => {
    setSaving(true);
    setNotice("");
    try {
      await api.put("/admin/providers/ffzstore", {
        name,
        base_url: baseURL,
        api_key: apiKey,
        is_active: isActive,
      });
      setAPIKey("");
      await mutate();
      setNotice("Konfigurasi FFZStore tersimpan.");
    } catch (error: any) {
      setNotice(error.response?.data?.message || "Gagal menyimpan FFZStore.");
    } finally {
      setSaving(false);
    }
  };

  const saveDigiflazz = async () => {
    setSaving(true);
    setNotice("");
    try {
      await api.put("/admin/providers/digiflazz", {
        name,
        base_url: baseURL,
        username: digiUsername,
        api_key: apiKey,
        is_active: isActive,
      });
      setAPIKey("");
      await mutate();
      setNotice("Konfigurasi Digiflazz tersimpan.");
    } catch (error: any) {
      setNotice(error.response?.data?.message || "Gagal menyimpan Digiflazz.");
    } finally {
      setSaving(false);
    }
  };

  const saveKiosgamer = async () => {
    setSaving(true);
    setNotice("");
    try {
      if (kiosSessionKey || kiosTotpSecret) {
        await api.post("/admin/kiosgamer/credentials", {
          session_key: kiosSessionKey,
          totp_secret: kiosTotpSecret,
        });
      }
      if (selected) {
        await api.put(`/admin/providers/${selected.id}`, {
          name,
          base_url: baseURL,
          is_active: isActive,
        });
      }
      setKiosSessionKey("");
      setKiosTotpSecret("");
      await mutate();
      const res = await api.get("/admin/kiosgamer/status");
      setKiosStatus(res.data.data);
      setNotice("Konfigurasi dan kredensial Kiosgamer berhasil tersimpan.");
    } catch (err: any) {
      setNotice(err.response?.data?.message || "Gagal menyimpan kredensial Kiosgamer.");
    } finally {
      setSaving(false);
    }
  };

  const handleKiosHealthCheck = async () => {
    setIsCheckingKios(true);
    setNotice("");
    try {
      await api.post("/admin/kiosgamer/health-check");
      const res = await api.get("/admin/kiosgamer/status");
      setKiosStatus(res.data.data);
      setNotice("Pengecekan sesi Kiosgamer berhasil: Sesi aktif dan valid!");
    } catch (err: any) {
      setNotice(err.response?.data?.message || "Gagal mengecek sesi Kiosgamer.");
    } finally {
      setIsCheckingKios(false);
    }
  };

  const handleKiosRecover = async () => {
    setIsRecoveringKios(true);
    setNotice("");
    try {
      await api.post("/admin/kiosgamer/recover");
      const res = await api.get("/admin/kiosgamer/status");
      setKiosStatus(res.data.data);
      setNotice("Sesi Kiosgamer berhasil dipulihkan secara otomatis melalui SSO!");
    } catch (err: any) {
      setNotice(err.response?.data?.message || "Pemulihan sesi otomatis Kiosgamer gagal.");
    } finally {
      setIsRecoveringKios(false);
    }
  };

  const getKiosStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sesi Aktif
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" /> Sesi Kadaluarsa
          </span>
        );
      case "REAUTH_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" /> Perlu Login Manual
          </span>
        );
      case "CHALLENGE_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Perlu Challenge/Captcha
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" /> Belum Dikonfigurasi
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5">
        <div className="flex gap-3">
          <Server className="h-5 w-5 text-indigo-300" />
          <div>
            <h1 className="text-xl font-bold text-white">Providers Center</h1>
            <p className="mt-1 text-sm text-slate-300">
              Kelola seluruh provider, pantau saldo real-time, dan atur kredensial masing-masing provider secara langsung melalui popup.
            </p>
          </div>
        </div>
      </div>

      {/* Global Invoice & Ref ID Format */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div>
          <h2 className="font-bold text-white">Format Invoice & Ref ID Global</h2>
          <p className="mt-1 text-xs text-slate-400">
            Berlaku untuk seluruh provider dan transaksi baru; tidak disimpan per provider.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-200">
            Template Invoice
            <input
              value={reference.invoice_template}
              onChange={(e) => setReference({ ...reference, invoice_template: e.target.value })}
              placeholder="INV-{date}-{random}"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm"
            />
          </label>
          <label className="text-sm text-slate-200">
            Template Ref ID
            <input
              value={reference.ref_id_template}
              onChange={(e) => setReference({ ...reference, ref_id_template: e.target.value })}
              placeholder="REF-{timestamp}-{random}"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {reference.tokens.map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => navigator.clipboard.writeText(token)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-slate-300 hover:border-indigo-500"
            >
              <Copy className="h-3 w-3" />
              {token}
            </button>
          ))}
        </div>
        <button
          onClick={saveReference}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          Simpan Format Global
        </button>
      </section>

      {/* Provider Cards with Balance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers?.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-white text-base">{item.name}</h2>
                  <p className="font-mono text-xs text-indigo-300">{item.code}</p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                    item.is_active
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700 bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.is_active ? "AKTIF" : "NONAKTIF"}
                </span>
              </div>

              {/* Saldo Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Wallet className="h-3.5 w-3.5 text-indigo-400" />
                    Saldo Provider
                  </span>
                  <button
                    onClick={() => refreshProviderBalance(item.id)}
                    disabled={checkingBalanceId === item.id}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
                    title="Cek Saldo Real-time"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${
                        checkingBalanceId === item.id ? "animate-spin text-indigo-400" : ""
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-emerald-400">
                    {formatBalance(item.balance, item.balance_unit)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {item.balance_checked_at ? formatDate(item.balance_checked_at) : "Belum dicek"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Credential:</span>
                <span className={item.api_key_configured ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                  {item.api_key_configured ? "Terkonfigurasi" : "Belum diisi"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 truncate max-w-[150px]">
                {item.base_url}
              </span>
              <button
                onClick={() => openManage(item)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Kelola
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Kelola Provider */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-bold text-white text-lg">Kelola {selected.name}</h2>
                <p className="font-mono text-xs text-indigo-300">{selected.code}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Notice Message */}
            {notice && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                <span>{notice}</span>
              </div>
            )}

            {/* DIGIFLAZZ MODAL CONTENT */}
            {selected.code.toUpperCase() === "DIGIFLAZZ" && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Provider</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Base URL Digiflazz</label>
                  <input
                    type="url"
                    value={baseURL}
                    onChange={(e) => setBaseURL(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Username Digiflazz</label>
                  <input
                    type="text"
                    value={digiUsername}
                    onChange={(e) => setDigiUsername(e.target.value)}
                    placeholder="Username akun buyer Digiflazz"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Production API Key Digiflazz{" "}
                    {digi?.api_key_configured && <span className="text-emerald-400">(sudah tersimpan)</span>}
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setAPIKey(e.target.value)}
                      placeholder={
                        digi?.api_key_configured
                          ? "Kosongkan untuk mempertahankan API key saat ini"
                          : "Masukkan API key Digiflazz"
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 font-mono text-slate-100"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Aktifkan Provider Digiflazz</span>
                </label>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <Link
                    href="/digiflazz"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Buka Digiflazz Center & Sinkronisasi <ExternalLink className="h-3 w-3" />
                  </Link>

                  <button
                    onClick={saveDigiflazz}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-60 transition"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Menyimpan..." : "Simpan Digiflazz"}
                  </button>
                </div>
              </div>
            )}

            {/* KIOSGAMER MODAL CONTENT (Mirip Kiosgamer Center) */}
            {selected.code.toUpperCase() === "KIOSGAMER" && (
              <div className="space-y-4 text-xs">
                {/* Session Status & Quick Actions */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Status Sesi Garena</span>
                      <div className="mt-1">{getKiosStatusBadge(kiosStatus?.status)}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleKiosHealthCheck}
                        disabled={isCheckingKios}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isCheckingKios ? "animate-spin" : ""}`} />
                        <span>{isCheckingKios ? "Memeriksa..." : "Cek Sesi"}</span>
                      </button>

                      <button
                        onClick={handleKiosRecover}
                        disabled={isRecoveringKios}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition disabled:opacity-50"
                        title="Pulihkan sesi otomatis menggunakan Garena SSO"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{isRecoveringKios ? "Memulihkan..." : "Pulihkan SSO"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Account Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Akun / Username:</span>
                      <span className="font-bold text-white text-xs">{kiosStatus?.username || "-"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">UID Akun:</span>
                      <span className="font-mono font-bold text-amber-300 text-xs">{kiosStatus?.uid || "-"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">TOTP 2FA Secret:</span>
                      <span className={kiosStatus?.has_totp_secret ? "text-emerald-400 font-semibold" : "text-amber-400"}>
                        {kiosStatus?.has_totp_secret ? "Terpasang" : "Belum diisi"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Masa Berlaku OAuth:</span>
                      <span className="text-slate-300 text-[11px]">{formatUnixExpiry(kiosStatus?.oauth_expiry_time)}</span>
                    </div>
                  </div>
                </div>

                {/* Credential Inputs */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Garena Session Key / Cookie (sso_key)
                  </label>
                  <div className="relative">
                    <input
                      type={showSessionKey ? "text" : "password"}
                      value={kiosSessionKey}
                      onChange={(e) => setKiosSessionKey(e.target.value)}
                      placeholder="Tempel session key / cookie Garena baru di sini"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-3 pr-10 font-mono text-xs text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSessionKey(!showSessionKey)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showSessionKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    TOTP 2FA Secret Key (16 karakter Base32)
                  </label>
                  <div className="relative">
                    <input
                      type={showTotpSecret ? "text" : "password"}
                      value={kiosTotpSecret}
                      onChange={(e) => setKiosTotpSecret(e.target.value)}
                      placeholder={
                        kiosStatus?.has_totp_secret
                          ? "Kosongkan untuk mempertahankan TOTP secret saat ini"
                          : "Contoh: JBSWY3DPEHPK3PXP"
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-3 pr-10 font-mono text-xs text-slate-100 uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTotpSecret(!showTotpSecret)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showTotpSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Aktifkan Provider Kiosgamer</span>
                </label>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <Link
                    href="/kiosgamer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Buka Kiosgamer Center Lengkap <ExternalLink className="h-3 w-3" />
                  </Link>

                  <button
                    onClick={saveKiosgamer}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-60 transition"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Menyimpan..." : "Simpan Kredensial Kiosgamer"}
                  </button>
                </div>
              </div>
            )}

            {/* FFZSTORE MODAL CONTENT */}
            {selected.code.toUpperCase() === "FFZSTORE" && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Provider</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Base URL FFZStore</label>
                  <input
                    type="url"
                    value={baseURL}
                    onChange={(e) => setBaseURL(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    API Key FFZStore{" "}
                    {ffz?.api_key_configured && <span className="text-emerald-400">(sudah tersimpan)</span>}
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setAPIKey(e.target.value)}
                      placeholder={
                        ffz?.api_key_configured
                          ? "Kosongkan untuk mempertahankan API key saat ini"
                          : "Masukkan API key FFZStore"
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 font-mono text-slate-100"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Aktifkan FFZStore</span>
                </label>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={saveFFZ}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-60 transition"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Menyimpan..." : "Simpan FFZStore"}
                  </button>
                </div>
              </div>
            )}

            {/* OTHER / CUSTOM PROVIDER FALLBACK */}
            {selected.code.toUpperCase() !== "DIGIFLAZZ" &&
              selected.code.toUpperCase() !== "KIOSGAMER" &&
              selected.code.toUpperCase() !== "FFZSTORE" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nama Provider</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Base URL</label>
                    <input
                      type="url"
                      value={baseURL}
                      onChange={(e) => setBaseURL(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-slate-100"
                    />
                  </div>

                  <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Aktifkan Provider</span>
                  </label>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={async () => {
                        setSaving(true);
                        setNotice("");
                        try {
                          await api.put(`/admin/providers/${selected.id}`, {
                            name,
                            base_url: baseURL,
                            is_active: isActive,
                          });
                          await mutate();
                          setNotice("Konfigurasi provider tersimpan.");
                        } catch (err: any) {
                          setNotice(err.response?.data?.message || "Gagal menyimpan.");
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-60 transition"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
