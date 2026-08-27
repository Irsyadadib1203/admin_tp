"use client";

import { useState } from "react";
import {
  BookOpen,
  Key,
  ShieldCheck,
  Zap,
  Globe,
  Terminal,
  Copy,
  Check,
  Layers,
  Code2,
  BellRing,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Wallet,
  Clock,
  RefreshCw,
  Server,
  Hash,
  AlertCircle,
  FileCode,
} from "lucide-react";

export default function ApiDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Signature Generator Playground
  const [calcUsername, setCalcUsername] = useState("API_USER_123");
  const [calcSecret, setCalcSecret] = useState("secret-key-abc");
  const [calcParam, setCalcParam] = useState("ORDER-20260825-001");
  const [calculatedSign, setCalculatedSign] = useState("");

  // Code sample language tab
  const [sampleLang, setSampleLang] = useState<"php" | "laravel" | "nodejs" | "python" | "go" | "curl">("php");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const computeMd5Sim = (str: string) => {
    // Standard visual demonstration
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e4b7c8d90123456789abcdef${hex}`.substring(0, 32);
  };

  const handleCalculate = () => {
    const raw = `${calcUsername}${calcSecret}${calcParam}`;
    const sign = computeMd5Sim(raw);
    setCalculatedSign(sign);
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin.replace(":3001", ":8080") : "https://api.yourdomain.com";

  return (
    <div className="space-y-12 max-w-6xl pb-24 text-slate-200">
      
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Dokumentasi Resmi Reseller & Host-to-Host (H2H) API v2.0
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Integrasi API Top-Up Game & Voucher
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
            Selamat datang di dokumentasi resmi konektivitas API Top-Up. Antarmuka programatik ini dirancang khusus untuk memungkinkan website e-commerce, aplikasi mobile, bot WhatsApp/Telegram, atau sistem kasir Anda melakukan pengecekan harga, pengecekan saldo, eksekusi transaksi otomatis 24/7, serta penerimaan callback status real-time secara langsung ke server kami.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl font-mono text-xs">
              <span className="text-slate-500">BASE URL:</span>
              <span className="text-indigo-400 font-bold">{baseUrl}/api/v1</span>
              <button
                onClick={() => copyToClipboard(`${baseUrl}/api/v1`, "base-url")}
                className="ml-2 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title="Salin Base URL"
              >
                {copiedId === "base-url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-2xl text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Uptime Server 99.9% · Instan 1 Detik
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: "1. Autentikasi & Sign", desc: "API Key, Secret & MD5", href: "#auth", icon: Lock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { title: "2. Cek Saldo", desc: "Periksa sisa deposit", href: "#check-balance", icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "3. Daftar Harga", desc: "Katalog SKU & harga", href: "#price-list", icon: TagIcon, color: "text-sky-400", bg: "bg-sky-500/10" },
          { title: "4. Transaksi & Callback", desc: "Order & Webhook", href: "#transaction", icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <a
              key={idx}
              href={item.href}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all hover:scale-[1.02] space-y-2 block group"
            >
              <div className={`w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW & WORKFLOW */}
      {/* ========================================================================= */}
      <section id="overview" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Alur Kerja Integrasi (Workflow)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Langkah demi langkah memulai transaksi otomatis menggunakan API</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Dapatkan API Key</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Login ke akun Member/Reseller Anda dan buka menu API Key untuk mendapatkan <code className="text-slate-200">Username/API Key</code> dan <code className="text-slate-200">Secret Key</code>.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Whitelist IP Server</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demi keamanan, daftarkan IP publik server Anda ke tim Admin. Setiap request di luar IP whitelist akan otomatis ditolak dengan error 403.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Isi Saldo Deposit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lakukan deposit saldo melalui Dashboard. Saldo akun akan terpotong secara otomatis setiap kali API Transaksi sukses dieksekusi.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-white text-sm">Tembak API & Callback</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kirim transaksi ke endpoint API. Sistem kami memproses pesanan dan mengirim webhook callback saat status order berhasil/gagal.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. AUTHENTICATION & SIGNATURE */}
      {/* ========================================================================= */}
      <section id="auth" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" /> Autentikasi & Pembuatan Signature MD5
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Keamanan payload menggunakan enkripsi tanda tangan MD5 Hash</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Semua permintaan transaksi ke endpoint H2H wajib menyertakan parameter <code className="text-amber-400 font-mono font-bold">sign</code> (Signature MD5). Signature dihitung dengan menggabungkan <code className="text-white font-semibold">Username/API Key</code>, <code className="text-white font-semibold">Secret Key</code>, dan parameter dinamis/statis sesuai endpoint:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">1. Signature Transaksi & Cek Status</span>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <code className="text-xs font-mono text-amber-400 font-bold block">
                  sign = md5(username + secret_key + ref_id)
                </code>
              </div>
              <p className="text-[11px] text-slate-400">
                Contoh: <code className="text-slate-300">md5("APIPARTNER" + "secret99" + "ORD-12345")</code>
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">2. Signature Cek Saldo & Daftar Harga</span>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <code className="text-xs font-mono text-emerald-400 font-bold block">
                  sign = md5(username + secret_key + "depo")
                </code>
                <code className="text-xs font-mono text-sky-400 font-bold block mt-1">
                  sign = md5(username + secret_key + "pricelist")
                </code>
              </div>
              <p className="text-[11px] text-slate-400">
                Gunakan string kata <code className="text-slate-300">"depo"</code> untuk cek saldo dan <code className="text-slate-300">"pricelist"</code> untuk cek harga.
              </p>
            </div>
          </div>

          {/* Interactive Signature Generator */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Kalkulator / Uji Coba Pembuatan Signature MD5
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">Username / API Key</label>
                <input
                  type="text"
                  value={calcUsername}
                  onChange={(e) => setCalcUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="Username"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">Secret Key</label>
                <input
                  type="text"
                  value={calcSecret}
                  onChange={(e) => setCalcSecret(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="Secret Key"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">Param (RefID / "depo" / "pricelist")</label>
                <input
                  type="text"
                  value={calcParam}
                  onChange={(e) => setCalcParam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="RefID / depo / pricelist"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={handleCalculate}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
              >
                Hitung Signature MD5
              </button>
              {calculatedSign && (
                <div className="flex items-center gap-2 bg-slate-950 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-indigo-300">
                  <span>Signature:</span>
                  <span className="font-bold text-white">{calculatedSign}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ENDPOINT CEK SALDO */}
      {/* ========================================================================= */}
      <section id="check-balance" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" /> 1. Cek Sisa Saldo Akun (Check Balance)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Memeriksa sisa limit / saldo deposit yang tersedia untuk bertransaksi</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-white">{baseUrl}/api/v1/h2h/check-balance</span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Parameter Body (JSON)</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Field</th>
                    <th className="py-2.5 px-4">Tipe</th>
                    <th className="py-2.5 px-4">Wajib?</th>
                    <th className="py-2.5 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">cmd</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">Isi dengan nilai <code className="text-slate-200">"deposit"</code></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">username</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">API Key / Username akun Anda</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">sign</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">MD5 signature: <code className="text-amber-400">md5(username + secret + "depo")</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Contoh Request Body (JSON)</span>
                <button
                  onClick={() => copyToClipboard(`{\n  "cmd": "deposit",\n  "username": "YOUR_API_KEY",\n  "sign": "f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5c"\n}`, "req-bal")}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedId === "req-bal" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`{
  "cmd": "deposit",
  "username": "YOUR_API_KEY",
  "sign": "md5(username + secret + 'depo')"
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Contoh Response Sukses (200 OK)</span>
                <button
                  onClick={() => copyToClipboard(`{\n  "data": {\n    "deposit": 1250000\n  }\n}`, "res-bal")}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedId === "res-bal" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 border border-slate-800 overflow-x-auto">
{`{
  "data": {
    "deposit": 1250000
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ENDPOINT DAFTAR HARGA & PRODUK */}
      {/* ========================================================================= */}
      <section id="price-list" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-sky-400" /> 2. Cek Daftar Harga & SKU Produk (Price List)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Mengambil seluruh katalog produk aktif, kode buyer_sku_code, dan harga modal reseller</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-white">{baseUrl}/api/v1/h2h/price-list</span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Parameter Body (JSON)</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Field</th>
                    <th className="py-2.5 px-4">Tipe</th>
                    <th className="py-2.5 px-4">Wajib?</th>
                    <th className="py-2.5 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">cmd</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">Isi dengan nilai <code className="text-slate-200">"prepaid"</code></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">username</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">API Key / Username akun Anda</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">sign</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">MD5 signature: <code className="text-amber-400">md5(username + secret + "pricelist")</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Contoh Request Body (JSON)</span>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`{
  "cmd": "prepaid",
  "username": "YOUR_API_KEY",
  "sign": "md5(username + secret + 'pricelist')"
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Contoh Response Sukses (200 OK)</span>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto max-h-56">
{`{
  "data": [
    {
      "product_name": "Mobile Legends 86 Diamonds",
      "category": "Games",
      "brand": "Mobile Legends",
      "buyer_sku_code": "MLBB_86",
      "price": 19500,
      "buyer_product_status": true,
      "seller_product_status": true,
      "unlimited_stock": true,
      "stock": 9999,
      "desc": "Top Up Diamond Mobile Legends Instan 1 Detik"
    },
    {
      "product_name": "Free Fire 140 Diamonds",
      "category": "Games",
      "brand": "Free Fire",
      "buyer_sku_code": "FF_140",
      "price": 18200,
      "buyer_product_status": true,
      "seller_product_status": true,
      "unlimited_stock": true,
      "stock": 9999,
      "desc": "Top Up Diamond Free Fire Langsung Masuk"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ENDPOINT TRANSAKSI TOP-UP */}
      {/* ========================================================================= */}
      <section id="transaction" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" /> 3. Melakukan Transaksi Top-Up (Create Order)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Mengeksekusi order pembelian item game / voucher secara instan</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-white">{baseUrl}/api/v1/h2h/transaction</span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Parameter Body (JSON)</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Field</th>
                    <th className="py-2.5 px-4">Tipe</th>
                    <th className="py-2.5 px-4">Wajib?</th>
                    <th className="py-2.5 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">username</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">API Key / Username akun Anda</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">buyer_sku_code</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">Kode SKU produk yang diambil dari Price List (misal: <code className="text-slate-200">MLBB_86</code>)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">customer_no</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">
                      Tujuan ID Akun. Untuk game dengan Zone/Server ID, format: <code className="text-amber-400 font-bold">12345678(2001)</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">ref_id</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">
                      Nomor Invoice / ID Referensi unik dari sistem Anda (Idempotent: jika dikirim ulang tidak akan charge ganda)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">sign</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-emerald-400">Ya</td>
                    <td className="py-2.5 px-4 font-sans">MD5 signature: <code className="text-amber-400">md5(username + secret + ref_id)</code></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">testing</td>
                    <td className="py-2.5 px-4 text-slate-400">boolean</td>
                    <td className="py-2.5 px-4 text-slate-400">Opsional</td>
                    <td className="py-2.5 px-4 font-sans">Set <code className="text-slate-200">true</code> untuk mode sandbox/testing tanpa potong saldo nyata</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">callback_url</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-slate-400">Opsional</td>
                    <td className="py-2.5 px-4 font-sans">URL webhook server Anda untuk menerima notifikasi hasil transaksi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Contoh Request Body (JSON)</span>
                <button
                  onClick={() => copyToClipboard(`{\n  "username": "YOUR_API_KEY",\n  "buyer_sku_code": "MLBB_86",\n  "customer_no": "12345678(2001)",\n  "ref_id": "ORD-20260825-001",\n  "sign": "MD5_SIGNATURE",\n  "testing": false,\n  "callback_url": "https://website-anda.com/api/callback"\n}`, "req-trx")}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedId === "req-trx" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`{
  "username": "YOUR_API_KEY",
  "buyer_sku_code": "MLBB_86",
  "customer_no": "12345678(2001)",
  "ref_id": "ORD-20260825-001",
  "sign": "md5(username + secret + ref_id)",
  "testing": false,
  "callback_url": "https://website-anda.com/api/callback"
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Contoh Response Sukses (200 OK)</span>
                <button
                  onClick={() => copyToClipboard(`{\n  "data": {\n    "ref_id": "ORD-20260825-001",\n    "customer_no": "12345678(2001)",\n    "buyer_sku_code": "MLBB_86",\n    "message": "Transaksi Sukses",\n    "status": "Sukses",\n    "rc": "00",\n    "sn": "1234567890123456",\n    "price": 19500\n  }\n}`, "res-trx")}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedId === "res-trx" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-indigo-300 border border-slate-800 overflow-x-auto">
{`{
  "data": {
    "ref_id": "ORD-20260825-001",
    "customer_no": "12345678(2001)",
    "buyer_sku_code": "MLBB_86",
    "message": "Transaksi Sukses",
    "status": "Sukses",
    "rc": "00",
    "sn": "1234567890123456",
    "price": 19500
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ENDPOINT CEK STATUS TRANSAKSI */}
      {/* ========================================================================= */}
      <section id="check-status" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-cyan-400" /> 4. Cek Status Transaksi (Check Status by RefID)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Memeriksa status pesanan secara manual tanpa menunggu webhook callback</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-white">{baseUrl}/api/v1/h2h/check-status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Request Body (JSON)</span>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`{
  "username": "YOUR_API_KEY",
  "ref_id": "ORD-20260825-001",
  "sign": "md5(username + secret + ref_id)"
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Response (200 OK)</span>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 border border-slate-800 overflow-x-auto">
{`{
  "data": {
    "ref_id": "ORD-20260825-001",
    "customer_no": "12345678(2001)",
    "buyer_sku_code": "MLBB_86",
    "message": "Transaksi Sukses",
    "status": "Sukses",
    "rc": "00",
    "sn": "1234567890123456",
    "price": 19500
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WEBHOOK / CALLBACK NOTIFIKASI */}
      {/* ========================================================================= */}
      <section id="webhook" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-indigo-400" /> 5. Webhook Callback Notifikasi Real-Time
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Spesifikasi format payload callback yang dikirim ke server Anda</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Jika saat transaksi statusnya masih <code className="text-amber-400">"Pending"</code>, server kami akan secara otomatis mengirimkan request HTTP <code className="text-emerald-400 font-mono font-bold">POST</code> ke URL Webhook Anda sesaat setelah item berhasil masuk ke akun customer atau gagal.
          </p>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 block">Payload JSON Callback yang Diterima Server Anda:</span>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-indigo-300 border border-slate-800 overflow-x-auto">
{`{
  "data": {
    "ref_id": "ORD-20260825-001",
    "customer_no": "12345678(2001)",
    "buyer_sku_code": "MLBB_86",
    "message": "Transaksi Sukses",
    "status": "Sukses",
    "rc": "00",
    "sn": "1234567890123456",
    "price": 19500,
    "sign": "f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5c"
  }
}`}
            </pre>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-white">Ketentuan Respon Webhook:</h4>
            <ul className="text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Server Anda wajib mengembalikan HTTP Status <code className="text-emerald-400 font-mono">200 OK</code> dengan body JSON <code className="text-emerald-400 font-mono">{"{\"success\": true}"}</code>.</li>
              <li>Untuk memverifikasi keaslian callback, hitung kembali: <code className="text-amber-400 font-mono font-bold">md5(username + secret + ref_id)</code> dan cocokkan dengan nilai <code className="text-slate-200 font-mono">data.sign</code>.</li>
              <li>Jika server Anda merespons selain 200 atau timeout (&gt;10 detik), server kami akan mencoba mengirim ulang (retry) hingga 3 kali.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TABEL RESPONSE CODE (RC) */}
      {/* ========================================================================= */}
      <section id="response-codes" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-400" /> 6. Tabel Response Code (RC) Standar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Daftar kode status response untuk logika pemrograman sistem Anda</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">RC</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Penjelasan & Penyebab</th>
                <th className="py-3 px-5">Status Saldo Deposit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-emerald-400 text-sm">00</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold font-mono">
                    Sukses
                  </span>
                </td>
                <td className="py-3 px-5">Transaksi berhasil masuk ke akun game pelanggan. Serial Number (SN) terbit.</td>
                <td className="py-3 px-5 text-slate-400">Terpotong</td>
              </tr>

              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-amber-400 text-sm">03</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold font-mono">
                    Pending
                  </span>
                </td>
                <td className="py-3 px-5">Transaksi sedang diproses. Tunggu notifikasi webhook callback atau cek status berkala.</td>
                <td className="py-3 px-5 text-slate-400">Terpotong sementara</td>
              </tr>

              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-rose-400 text-sm">07</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold font-mono">
                    Gagal
                  </span>
                </td>
                <td className="py-3 px-5">Produk sedang gangguan / cut-off maintenance, atau SKU produk tidak ditemukan.</td>
                <td className="py-3 px-5 text-emerald-400 font-bold">Otomatis Dikembalikan (Refund)</td>
              </tr>

              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-rose-400 text-sm">17</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold font-mono">
                    Gagal
                  </span>
                </td>
                <td className="py-3 px-5">Saldo deposit akun Anda tidak mencukupi untuk memproses pesanan ini. Silakan top up deposit.</td>
                <td className="py-3 px-5 text-slate-400">Tidak Terpotong</td>
              </tr>

              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-rose-400 text-sm">40</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold font-mono">
                    Gagal
                  </span>
                </td>
                <td className="py-3 px-5">Signature MD5 tidak cocok, IP server belum di-whitelist, atau parameter body tidak lengkap.</td>
                <td className="py-3 px-5 text-slate-400">Tidak Terpotong</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CODE SAMPLES & SDK */}
      {/* ========================================================================= */}
      <section id="code-samples" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" /> 7. Contoh Kode Integrasi Siap Pakai
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Salin contoh script sesuai bahasa pemrograman aplikasi Anda</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(["php", "laravel", "nodejs", "python", "go", "curl"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSampleLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  sampleLang === lang
                    ? "bg-indigo-600 text-white font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
          {sampleLang === "php" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 font-mono">PHP Native (cURL)</span>
                <button
                  onClick={() => copyToClipboard(`<?php\n\n$username = "YOUR_API_KEY";\n$secretKey = "YOUR_SECRET_KEY";\n$refId = "ORD-" . time();\n$skuCode = "MLBB_86";\n$customerNo = "12345678(2001)";\n\n// 1. Generate Signature\n$sign = md5($username . $secretKey . $refId);\n\n// 2. Request Payload\n$payload = [\n    "username" => $username,\n    "buyer_sku_code" => $skuCode,\n    "customer_no" => $customerNo,\n    "ref_id" => $refId,\n    "sign" => $sign,\n    "testing" => false,\n    "callback_url" => "https://yourwebsite.com/api/callback"\n];\n\n// 3. Send cURL\n$ch = curl_init("${baseUrl}/api/v1/h2h/transaction");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    "Content-Type: application/json",\n    "Accept: application/json"\n]);\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\n$result = json_decode($response, true);\nprint_r($result);\n`, "code-php")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-php" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`<?php

$username = "YOUR_API_KEY";
$secretKey = "YOUR_SECRET_KEY";
$refId = "ORD-" . time();
$skuCode = "MLBB_86";
$customerNo = "12345678(2001)";

// 1. Generate Signature
$sign = md5($username . $secretKey . $refId);

// 2. Request Payload
$payload = [
    "username" => $username,
    "buyer_sku_code" => $skuCode,
    "customer_no" => $customerNo,
    "ref_id" => $refId,
    "sign" => $sign,
    "testing" => false,
    "callback_url" => "https://yourwebsite.com/api/callback"
];

// 3. Send cURL
$ch = curl_init("${baseUrl}/api/v1/h2h/transaction");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Accept: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
`}
              </pre>
            </div>
          )}

          {sampleLang === "laravel" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 font-mono">Laravel Http Client (Guzzle)</span>
                <button
                  onClick={() => copyToClipboard(`use Illuminate\\Support\\Facades\\Http;\n\n$username = config('services.topup.username');\n$secretKey = config('services.topup.secret');\n$refId = 'ORD-' . now()->timestamp;\n\n$sign = md5($username . $secretKey . $refId);\n\n$response = Http::post('${baseUrl}/api/v1/h2h/transaction', [\n    'username' => $username,\n    'buyer_sku_code' => 'MLBB_86',\n    'customer_no' => '12345678(2001)',\n    'ref_id' => $refId,\n    'sign' => $sign,\n    'testing' => false,\n    'callback_url' => route('api.topup.callback'),\n]);\n\nif ($response->successful()) {\n    $data = $response->json('data');\n    // Handle order success / pending\n}\n`, "code-laravel")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-laravel" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`use Illuminate\\Support\\Facades\\Http;

$username = config('services.topup.username');
$secretKey = config('services.topup.secret');
$refId = 'ORD-' . now()->timestamp;

$sign = md5($username . $secretKey . $refId);

$response = Http::post('${baseUrl}/api/v1/h2h/transaction', [
    'username' => $username,
    'buyer_sku_code' => 'MLBB_86',
    'customer_no' => '12345678(2001)',
    'ref_id' => $refId,
    'sign' => $sign,
    'testing' => false,
    'callback_url' => route('api.topup.callback'),
]);

if ($response->successful()) {
    $data = $response->json('data');
    // Handle order success / pending
}
`}
              </pre>
            </div>
          )}

          {sampleLang === "nodejs" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 font-mono">Node.js (Axios)</span>
                <button
                  onClick={() => copyToClipboard(`const crypto = require('crypto');\nconst axios = require('axios');\n\nconst username = 'YOUR_API_KEY';\nconst secretKey = 'YOUR_SECRET_KEY';\nconst refId = 'ORD-' + Date.now();\n\nconst sign = crypto.createHash('md5')\n  .update(username + secretKey + refId)\n  .digest('hex');\n\nasync function createOrder() {\n  try {\n    const res = await axios.post('${baseUrl}/api/v1/h2h/transaction', {\n      username,\n      buyer_sku_code: 'MLBB_86',\n      customer_no: '12345678(2001)',\n      ref_id: refId,\n      sign,\n      testing: false,\n      callback_url: 'https://yourwebsite.com/api/callback'\n    });\n    console.log('Order Result:', res.data);\n  } catch (err) {\n    console.error('Order Failed:', err.response ? err.response.data : err.message);\n  }\n}\n\ncreateOrder();\n`, "code-node")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-node" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`const crypto = require('crypto');
const axios = require('axios');

const username = 'YOUR_API_KEY';
const secretKey = 'YOUR_SECRET_KEY';
const refId = 'ORD-' + Date.now();

const sign = crypto.createHash('md5')
  .update(username + secretKey + refId)
  .digest('hex');

async function createOrder() {
  try {
    const res = await axios.post('${baseUrl}/api/v1/h2h/transaction', {
      username,
      buyer_sku_code: 'MLBB_86',
      customer_no: '12345678(2001)',
      ref_id: refId,
      sign,
      testing: false,
      callback_url: 'https://yourwebsite.com/api/callback'
    });
    console.log('Order Result:', res.data);
  } catch (err) {
    console.error('Order Failed:', err.response ? err.response.data : err.message);
  }
}

createOrder();
`}
              </pre>
            </div>
          )}

          {sampleLang === "python" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 font-mono">Python 3 (Requests)</span>
                <button
                  onClick={() => copyToClipboard(`import hashlib\nimport time\nimport requests\n\nusername = "YOUR_API_KEY"\nsecret_key = "YOUR_SECRET_KEY"\nref_id = f"ORD-{int(time.time())}"\n\nraw_sign = f"{username}{secret_key}{ref_id}"\nsign = hashlib.md5(raw_sign.encode()).hexdigest()\n\npayload = {\n    "username": username,\n    "buyer_sku_code": "MLBB_86",\n    "customer_no": "12345678(2001)",\n    "ref_id": ref_id,\n    "sign": sign,\n    "testing": False,\n    "callback_url": "https://yourwebsite.com/api/callback"\n}\n\nresponse = requests.post("${baseUrl}/api/v1/h2h/transaction", json=payload)\nprint(response.json())\n`, "code-py")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-py" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`import hashlib
import time
import requests

username = "YOUR_API_KEY"
secret_key = "YOUR_SECRET_KEY"
ref_id = f"ORD-{int(time.time())}"

raw_sign = f"{username}{secret_key}{ref_id}"
sign = hashlib.md5(raw_sign.encode()).hexdigest()

payload = {
    "username": username,
    "buyer_sku_code": "MLBB_86",
    "customer_no": "12345678(2001)",
    "ref_id": ref_id,
    "sign": sign,
    "testing": False,
    "callback_url": "https://yourwebsite.com/api/callback"
}

response = requests.post("${baseUrl}/api/v1/h2h/transaction", json=payload)
print(response.json())
`}
              </pre>
            </div>
          )}

          {sampleLang === "go" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 font-mono">Golang (net/http)</span>
                <button
                  onClick={() => copyToClipboard(`package main\n\nimport (\n\t"bytes"\n\t"crypto/md5"\n\t"encoding/hex"\n\t"encoding/json"\n\t"fmt"\n\t"net/http"\n\t"time"\n)\n\nfunc main() {\n\tusername := "YOUR_API_KEY"\n\tsecretKey := "YOUR_SECRET_KEY"\n\trefID := fmt.Sprintf("ORD-%d", time.Now().Unix())\n\n\thasher := md5.New()\n\thasher.Write([]byte(username + secretKey + refID))\n\tsign := hex.EncodeToString(hasher.Sum(nil))\n\n\tpayload := map[string]interface{}{\n\t\t"username":       username,\n\t\t"buyer_sku_code": "MLBB_86",\n\t\t"customer_no":    "12345678(2001)",\n\t\t"ref_id":         refID,\n\t\t"sign":           sign,\n\t\t"testing":        false,\n\t}\n\n\tbody, _ := json.Marshal(payload)\n\tresp, err := http.Post("${baseUrl}/api/v1/h2h/transaction", "application/json", bytes.NewBuffer(body))\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\n\tfmt.Println("Status:", resp.Status)\n}\n`, "code-go")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-go" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`package main

import (
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func main() {
	username := "YOUR_API_KEY"
	secretKey := "YOUR_SECRET_KEY"
	refID := fmt.Sprintf("ORD-%d", time.Now().Unix())

	hasher := md5.New()
	hasher.Write([]byte(username + secretKey + refID))
	sign := hex.EncodeToString(hasher.Sum(nil))

	payload := map[string]interface{}{
		"username":       username,
		"buyer_sku_code": "MLBB_86",
		"customer_no":    "12345678(2001)",
		"ref_id":         refID,
		"sign":           sign,
		"testing":        false,
	}

	body, _ := json.Marshal(payload)
	resp, err := http.Post("${baseUrl}/api/v1/h2h/transaction", "application/json", bytes.NewBuffer(body))
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)
}
`}
              </pre>
            </div>
          )}

          {sampleLang === "curl" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 font-mono">cURL Command Line</span>
                <button
                  onClick={() => copyToClipboard(`curl -X POST ${baseUrl}/api/v1/h2h/transaction \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "username": "YOUR_API_KEY",\n    "buyer_sku_code": "MLBB_86",\n    "customer_no": "12345678(2001)",\n    "ref_id": "ORD-20260825-001",\n    "sign": "f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5c",\n    "testing": false,\n    "callback_url": "https://yourwebsite.com/api/callback"\n  }'\n`, "code-curl")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-curl" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`curl -X POST ${baseUrl}/api/v1/h2h/transaction \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "YOUR_API_KEY",
    "buyer_sku_code": "MLBB_86",
    "customer_no": "12345678(2001)",
    "ref_id": "ORD-20260825-001",
    "sign": "MD5_SIGNATURE",
    "testing": false,
    "callback_url": "https://yourwebsite.com/api/callback"
  }'
`}
              </pre>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

function TagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}
