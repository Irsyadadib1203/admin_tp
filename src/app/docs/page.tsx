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

// Standard RFC 1321 Pure JS MD5 implementation for client-side playground
function md5(string: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }
  function F(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }
  function G(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }
  function H(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }
  function I(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function convertToWordArray(str: string) {
    let lWordCount;
    const lMessageLength = str.length;
    const lNumberOfWordsTempOne = lMessageLength + 8;
    const lNumberOfWordsTempTwo =
      (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function wordToHex(lValue: number) {
    let WordToHexValue = "",
      WordToHexValueTemp = "",
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValueTemp = "0" + lByte.toString(16);
      WordToHexValue =
        WordToHexValue +
        WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
    }
    return WordToHexValue;
  }

  const x = convertToWordArray(string);
  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476;

  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  const temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  return temp.toLowerCase();
}

export default function ApiDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Signature Generator Playground
  const [calcUsername, setCalcUsername] = useState("top_partner_abc");
  const [calcSecret, setCalcSecret] = useState("secret-key-9988");
  const [calcParam, setCalcParam] = useState("INV-20260901-001");
  const [calculatedSign, setCalculatedSign] = useState("");

  // Code sample language tab
  const [sampleLang, setSampleLang] = useState<
    "php" | "laravel" | "nodejs" | "python" | "go" | "curl"
  >("php");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCalculate = () => {
    const raw = `${calcUsername}${calcSecret}${calcParam}`;
    const sign = md5(raw);
    setCalculatedSign(sign);
  };

  // Production API Base URL
  const baseUrl = "https://api1235.irxplay.com";

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
            Integrasi API Top-Up Game & Voucher IRXPlay
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
            Selamat datang di dokumentasi resmi konektivitas API Top-Up IRXPlay. Antarmuka programatik ini dirancang khusus untuk memungkinkan website e-commerce, aplikasi mobile, bot WhatsApp/Telegram, atau sistem kasir Anda melakukan pengecekan harga, pengecekan saldo, eksekusi transaksi otomatis 24/7, serta penerimaan callback status real-time secara langsung ke server kami.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl font-mono text-xs">
              <span className="text-slate-500">PRODUCTION BASE URL:</span>
              <span className="text-indigo-400 font-bold">{baseUrl}/api/v1</span>
              <button
                onClick={() => copyToClipboard(`${baseUrl}/api/v1`, "base-url")}
                className="ml-2 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title="Salin Base URL"
              >
                {copiedId === "base-url" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
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
          {
            title: "1. Autentikasi & Sign",
            desc: "API Key, Secret & MD5",
            href: "#auth",
            icon: Lock,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            title: "2. Cek Saldo",
            desc: "Periksa sisa deposit",
            href: "#check-balance",
            icon: Wallet,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            title: "3. Daftar Harga",
            desc: "Katalog SKU & harga",
            href: "#price-list",
            icon: TagIcon,
            color: "text-sky-400",
            bg: "bg-sky-500/10",
          },
          {
            title: "4. Transaksi & Callback",
            desc: "Order & Webhook",
            href: "#transaction",
            icon: Zap,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <a
              key={idx}
              href={item.href}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all hover:scale-[1.02] space-y-2 block group"
            >
              <div
                className={`w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
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
            <p className="text-xs text-slate-400 mt-0.5">
              Langkah demi langkah memulai transaksi otomatis menggunakan API
            </p>
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
          <p className="text-xs text-slate-400 mt-0.5">
            Keamanan payload menggunakan enkripsi tanda tangan MD5 Hash
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Semua permintaan transaksi ke endpoint H2H wajib menyertakan parameter <code className="text-amber-400 font-mono font-bold">sign</code> (Signature MD5). Signature dihitung dengan menggabungkan <code className="text-white font-semibold">Username/API Key</code>, <code className="text-white font-semibold">Secret Key</code>, dan parameter dinamis/statis sesuai endpoint:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                1. Signature Transaksi & Cek Status
              </span>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <code className="text-xs font-mono text-amber-400 font-bold block">
                  sign = md5(username + secret_key + ref_id)
                </code>
              </div>
              <p className="text-[11px] text-slate-400">
                Contoh: <code className="text-slate-300">md5(&quot;top_partner_abc&quot; + &quot;secret-key-9988&quot; + &quot;INV-001&quot;)</code>
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                2. Signature Cek Saldo & Daftar Harga
              </span>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <code className="text-xs font-mono text-emerald-400 font-bold block">
                  sign = md5(username + secret_key + &quot;depo&quot;)
                </code>
                <code className="text-xs font-mono text-sky-400 font-bold block mt-1">
                  sign = md5(username + secret_key + &quot;pricelist&quot;)
                </code>
              </div>
              <p className="text-[11px] text-slate-400">
                Gunakan string statis <code className="text-slate-300">&quot;depo&quot;</code> untuk cek saldo dan <code className="text-slate-300">&quot;pricelist&quot;</code> untuk cek harga.
              </p>
            </div>
          </div>

          {/* Interactive Signature Generator */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Kalkulator Signature MD5 Real-Time
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                  Username / API Key
                </label>
                <input
                  type="text"
                  value={calcUsername}
                  onChange={(e) => setCalcUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="Username"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                  Secret Key
                </label>
                <input
                  type="text"
                  value={calcSecret}
                  onChange={(e) => setCalcSecret(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="Secret Key"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                  Param (RefID / &quot;depo&quot; / &quot;pricelist&quot;)
                </label>
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
                  <span>Hasil Signature:</span>
                  <span className="font-bold text-emerald-400">{calculatedSign}</span>
                  <button
                    onClick={() => copyToClipboard(calculatedSign, "calc-sign")}
                    className="ml-1 text-slate-400 hover:text-white"
                  >
                    {copiedId === "calc-sign" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
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
          <p className="text-xs text-slate-400 mt-0.5">
            Memeriksa sisa limit / saldo deposit yang tersedia untuk bertransaksi
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {baseUrl}/api/v1/h2h/check-balance
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              (alias: {baseUrl}/v1/cek-saldo)
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Parameter Body (JSON)
            </h4>
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
                    <td className="py-2.5 px-4 font-sans">
                      Isi dengan nilai <code className="text-slate-200">&quot;deposit&quot;</code>
                    </td>
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
                    <td className="py-2.5 px-4 font-sans">
                      MD5 signature: <code className="text-amber-400">md5(username + secret + &quot;depo&quot;)</code>
                    </td>
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
                  onClick={() =>
                    copyToClipboard(
                      `{\n  "cmd": "deposit",\n  "username": "top_partner_abc",\n  "sign": "md5(username + secret + 'depo')"\n}`,
                      "req-bal"
                    )
                  }
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedId === "req-bal" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`{
  "cmd": "deposit",
  "username": "top_partner_abc",
  "sign": "f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5c"
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Contoh Response Sukses (200 OK)</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `{\n  "data": {\n    "deposit": 1250000\n  }\n}`,
                      "res-bal"
                    )
                  }
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedId === "res-bal" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin
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
          <p className="text-xs text-slate-400 mt-0.5">
            Mengambil seluruh katalog produk aktif, kode buyer_sku_code, dan harga modal reseller
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {baseUrl}/api/v1/h2h/price-list
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              (alias: {baseUrl}/v1/price-list)
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Parameter Body (JSON)
            </h4>
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
                    <td className="py-2.5 px-4 font-sans">
                      Isi dengan nilai <code className="text-slate-200">&quot;prepaid&quot;</code>
                    </td>
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
                    <td className="py-2.5 px-4 font-sans">
                      MD5 signature: <code className="text-amber-400">md5(username + secret + &quot;pricelist&quot;)</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">code</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-slate-400">Opsional</td>
                    <td className="py-2.5 px-4 font-sans">Filter spesifik kode SKU produk</td>
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
  "username": "top_partner_abc",
  "sign": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
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
      "brand": "Mobile Legends: Bang Bang",
      "type": "Umum",
      "seller_name": "IRXPlay Engine",
      "price": 19200,
      "buyer_sku_code": "MLBB_86",
      "buyer_product_status": true,
      "seller_product_status": true,
      "unlimited_stock": true,
      "stock": 9999,
      "multi": true,
      "start_cut_off": "00:00",
      "end_cut_off": "23:59",
      "desc": "Top Up Diamond Mobile Legends Instan 1 Detik"
    },
    {
      "product_name": "Free Fire 140 Diamonds",
      "category": "Games",
      "brand": "Free Fire",
      "type": "Umum",
      "seller_name": "IRXPlay Engine",
      "price": 18200,
      "buyer_sku_code": "FF_140",
      "buyer_product_status": true,
      "seller_product_status": true,
      "unlimited_stock": true,
      "stock": 9999,
      "multi": true,
      "start_cut_off": "00:00",
      "end_cut_off": "23:59",
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
          <p className="text-xs text-slate-400 mt-0.5">
            Mengeksekusi order pembelian item game / voucher secara instan
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {baseUrl}/api/v1/h2h/transaction
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              (alias: {baseUrl}/v1/transaction)
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Parameter Body (JSON)
            </h4>
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
                    <td className="py-2.5 px-4 font-sans">
                      Kode SKU produk yang diambil dari Price List (misal: <code className="text-slate-200">MLBB_86</code>)
                    </td>
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
                    <td className="py-2.5 px-4 font-sans">
                      MD5 signature: <code className="text-amber-400">md5(username + secret + ref_id)</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">testing</td>
                    <td className="py-2.5 px-4 text-slate-400">boolean</td>
                    <td className="py-2.5 px-4 text-slate-400">Opsional</td>
                    <td className="py-2.5 px-4 font-sans">
                      Set <code className="text-slate-200">true</code> untuk mode sandbox/testing tanpa potong saldo nyata
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-indigo-300">callback_url</td>
                    <td className="py-2.5 px-4 text-slate-400">string</td>
                    <td className="py-2.5 px-4 text-slate-400">Opsional</td>
                    <td className="py-2.5 px-4 font-sans">
                      URL webhook server Anda untuk menerima notifikasi hasil transaksi
                    </td>
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
                  onClick={() =>
                    copyToClipboard(
                      `{\n  "username": "top_partner_abc",\n  "buyer_sku_code": "MLBB_86",\n  "customer_no": "12345678(2001)",\n  "ref_id": "INV-20260901-001",\n  "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",\n  "testing": false,\n  "callback_url": "https://domain-partner.com/api/callback"\n}`,
                      "req-trx"
                    )
                  }
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedId === "req-trx" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`{
  "username": "top_partner_abc",
  "buyer_sku_code": "MLBB_86",
  "customer_no": "12345678(2001)",
  "ref_id": "INV-20260901-001",
  "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
  "testing": false,
  "callback_url": "https://domain-partner.com/api/callback"
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Contoh Response Sukses (200 OK)</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `{\n  "data": {\n    "ref_id": "INV-20260901-001",\n    "customer_no": "12345678(2001)",\n    "buyer_sku_code": "MLBB_86",\n    "message": "Transaksi Sukses",\n    "status": "Sukses",\n    "rc": "00",\n    "sn": "MLBB-1234567890123456",\n    "price": 19200,\n    "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d"\n  }\n}`,
                      "res-trx"
                    )
                  }
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedId === "res-trx" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-indigo-300 border border-slate-800 overflow-x-auto">
{`{
  "data": {
    "ref_id": "INV-20260901-001",
    "customer_no": "12345678(2001)",
    "buyer_sku_code": "MLBB_86",
    "message": "Transaksi Sukses",
    "status": "Sukses",
    "rc": "00",
    "sn": "MLBB-1234567890123456",
    "price": 19200,
    "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d"
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
          <p className="text-xs text-slate-400 mt-0.5">
            Memeriksa status pesanan secara manual tanpa menunggu webhook callback
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
              POST
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {baseUrl}/api/v1/h2h/check-status
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Request Body (JSON)</span>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`{
  "username": "top_partner_abc",
  "ref_id": "INV-20260901-001",
  "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d"
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Response (200 OK)</span>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 border border-slate-800 overflow-x-auto">
{`{
  "data": {
    "ref_id": "INV-20260901-001",
    "customer_no": "12345678(2001)",
    "buyer_sku_code": "MLBB_86",
    "message": "Transaksi Sukses",
    "status": "Sukses",
    "rc": "00",
    "sn": "MLBB-1234567890123456",
    "price": 19200,
    "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d"
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
          <p className="text-xs text-slate-400 mt-0.5">
            Spesifikasi format payload callback yang dikirim ke server Anda
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            Jika saat transaksi statusnya masih <code className="text-amber-400">&quot;Pending&quot;</code>, server IRXPlay akan secara otomatis mengirimkan request HTTP <code className="text-emerald-400 font-mono font-bold">POST</code> ke URL Webhook Anda sesaat setelah item berhasil masuk ke akun customer atau gagal.
          </p>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 block">
              Payload JSON Callback yang Diterima Server Anda:
            </span>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-indigo-300 border border-slate-800 overflow-x-auto">
{`{
  "data": {
    "ref_id": "INV-20260901-001",
    "customer_no": "12345678(2001)",
    "buyer_sku_code": "MLBB_86",
    "message": "Transaksi Sukses",
    "status": "Sukses",
    "rc": "00",
    "sn": "MLBB-1234567890123456",
    "price": 19200,
    "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d"
  }
}`}
            </pre>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-white">Ketentuan Respon Webhook:</h4>
            <ul className="text-slate-400 space-y-1.5 list-disc list-inside">
              <li>
                Server Anda wajib mengembalikan HTTP Status <code className="text-emerald-400 font-mono">200 OK</code> dengan body JSON <code className="text-emerald-400 font-mono">{`{"success": true}`}</code>.
              </li>
              <li>
                Untuk memverifikasi keaslian callback, hitung kembali: <code className="text-amber-400 font-mono font-bold">md5(username + secret + ref_id)</code> dan cocokkan dengan nilai <code className="text-slate-200 font-mono">data.sign</code>.
              </li>
              <li>
                Jika server Anda merespons selain 200 atau timeout (&gt;10 detik), server kami akan mencoba mengirim ulang (retry) hingga 3 kali.
              </li>
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
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar kode status response untuk logika pemrograman sistem Anda
          </p>
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
                <td className="py-3 px-5">
                  Transaksi berhasil masuk ke akun game pelanggan. Serial Number (SN) terbit.
                </td>
                <td className="py-3 px-5 text-slate-400">Terpotong</td>
              </tr>

              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-amber-400 text-sm">03</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold font-mono">
                    Pending
                  </span>
                </td>
                <td className="py-3 px-5">
                  Transaksi sedang diproses. Tunggu notifikasi webhook callback atau cek status berkala.
                </td>
                <td className="py-3 px-5 text-slate-400">Terpotong sementara</td>
              </tr>

              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-rose-400 text-sm">07</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold font-mono">
                    Gagal
                  </span>
                </td>
                <td className="py-3 px-5">
                  Produk sedang gangguan / cut-off maintenance, atau SKU produk tidak ditemukan.
                </td>
                <td className="py-3 px-5 text-emerald-400 font-bold">Otomatis Dikembalikan (Refund)</td>
              </tr>

              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-rose-400 text-sm">17</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold font-mono">
                    Gagal
                  </span>
                </td>
                <td className="py-3 px-5">
                  Saldo deposit akun Anda tidak mencukupi untuk memproses pesanan ini. Silakan top up deposit.
                </td>
                <td className="py-3 px-5 text-slate-400">Tidak Terpotong</td>
              </tr>

              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-5 font-mono font-black text-rose-400 text-sm">40</td>
                <td className="py-3 px-5">
                  <span className="px-2.5 py-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold font-mono">
                    Gagal
                  </span>
                </td>
                <td className="py-3 px-5">
                  Signature MD5 tidak cocok, IP server belum di-whitelist, atau parameter body tidak lengkap.
                </td>
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
            <p className="text-xs text-slate-400 mt-0.5">
              Salin contoh script sesuai bahasa pemrograman aplikasi Anda
            </p>
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
                  onClick={() =>
                    copyToClipboard(
                      `<?php\n\n$username = "YOUR_API_KEY";\n$secretKey = "YOUR_SECRET_KEY";\n$refId = "INV-" . time();\n$skuCode = "MLBB_86";\n$customerNo = "12345678(2001)";\n\n// 1. Generate Signature\n$sign = md5($username . $secretKey . $refId);\n\n// 2. Request Payload\n$payload = [\n    "username" => $username,\n    "buyer_sku_code" => $skuCode,\n    "customer_no" => $customerNo,\n    "ref_id" => $refId,\n    "sign" => $sign,\n    "testing" => false,\n    "callback_url" => "https://yourwebsite.com/api/callback"\n];\n\n// 3. Send cURL\n$ch = curl_init("${baseUrl}/api/v1/h2h/transaction");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    "Content-Type: application/json",\n    "Accept: application/json"\n]);\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\n$result = json_decode($response, true);\nprint_r($result);\n`,
                      "code-php"
                    )
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-php" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`<?php

$username = "YOUR_API_KEY";
$secretKey = "YOUR_SECRET_KEY";
$refId = "INV-" . time();
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
                  onClick={() =>
                    copyToClipboard(
                      `use Illuminate\\Support\\Facades\\Http;\n\n$username = config('services.topup.username');\n$secretKey = config('services.topup.secret');\n$refId = 'INV-' . now()->timestamp;\n\n$sign = md5($username . $secretKey . $refId);\n\n$response = Http::post('${baseUrl}/api/v1/h2h/transaction', [\n    'username' => $username,\n    'buyer_sku_code' => 'MLBB_86',\n    'customer_no' => '12345678(2001)',\n    'ref_id' => $refId,\n    'sign' => $sign,\n    'testing' => false,\n    'callback_url' => route('api.topup.callback'),\n]);\n\nif ($response->successful()) {\n    $data = $response->json('data');\n    // Handle order success / pending\n}\n`,
                      "code-laravel"
                    )
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-laravel" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`use Illuminate\\Support\\Facades\\Http;

$username = config('services.topup.username');
$secretKey = config('services.topup.secret');
$refId = 'INV-' . now()->timestamp;

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
                  onClick={() =>
                    copyToClipboard(
                      `const crypto = require('crypto');\nconst axios = require('axios');\n\nconst username = 'YOUR_API_KEY';\nconst secretKey = 'YOUR_SECRET_KEY';\nconst refId = 'INV-' + Date.now();\n\nconst sign = crypto.createHash('md5')\n  .update(username + secretKey + refId)\n  .digest('hex');\n\nasync function createOrder() {\n  try {\n    const res = await axios.post('${baseUrl}/api/v1/h2h/transaction', {\n      username,\n      buyer_sku_code: 'MLBB_86',\n      customer_no: '12345678(2001)',\n      ref_id: refId,\n      sign,\n      testing: false,\n      callback_url: 'https://yourwebsite.com/api/callback'\n    });\n    console.log('Order Result:', res.data);\n  } catch (err) {\n    console.error('Order Failed:', err.response ? err.response.data : err.message);\n  }\n}\n\ncreateOrder();\n`,
                      "code-node"
                    )
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-node" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`const crypto = require('crypto');
const axios = require('axios');

const username = 'YOUR_API_KEY';
const secretKey = 'YOUR_SECRET_KEY';
const refId = 'INV-' + Date.now();

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
                  onClick={() =>
                    copyToClipboard(
                      `import hashlib\nimport time\nimport requests\n\nusername = "YOUR_API_KEY"\nsecret_key = "YOUR_SECRET_KEY"\nref_id = f"INV-{int(time.time())}"\n\nraw_sign = f"{username}{secret_key}{ref_id}"\nsign = hashlib.md5(raw_sign.encode()).hexdigest()\n\npayload = {\n    "username": username,\n    "buyer_sku_code": "MLBB_86",\n    "customer_no": "12345678(2001)",\n    "ref_id": ref_id,\n    "sign": sign,\n    "testing": False,\n    "callback_url": "https://yourwebsite.com/api/callback"\n}\n\nresponse = requests.post("${baseUrl}/api/v1/h2h/transaction", json=payload)\nprint(response.json())\n`,
                      "code-py"
                    )
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-py" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`import hashlib
import time
import requests

username = "YOUR_API_KEY"
secret_key = "YOUR_SECRET_KEY"
ref_id = f"INV-{int(time.time())}"

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
                  onClick={() =>
                    copyToClipboard(
                      `package main\n\nimport (\n\t"bytes"\n\t"crypto/md5"\n\t"encoding/hex"\n\t"encoding/json"\n\t"fmt"\n\t"net/http"\n\t"time"\n)\n\nfunc main() {\n\tusername := "YOUR_API_KEY"\n\tsecretKey := "YOUR_SECRET_KEY"\n\trefID := fmt.Sprintf("INV-%d", time.Now().Unix())\n\n\thasher := md5.New()\n\thasher.Write([]byte(username + secretKey + refID))\n\tsign := hex.EncodeToString(hasher.Sum(nil))\n\n\tpayload := map[string]interface{}{\n\t\t"username":       username,\n\t\t"buyer_sku_code": "MLBB_86",\n\t\t"customer_no":    "12345678(2001)",\n\t\t"ref_id":         refID,\n\t\t"sign":           sign,\n\t\t"testing":        false,\n\t\t"callback_url":   "https://yourwebsite.com/api/callback",\n\t}\n\n\tbody, _ := json.Marshal(payload)\n\tresp, err := http.Post("${baseUrl}/api/v1/h2h/transaction", "application/json", bytes.NewBuffer(body))\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\n\tfmt.Println("Status:", resp.Status)\n}\n`,
                      "code-go"
                    )
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-go" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin Kode
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
	refID := fmt.Sprintf("INV-%d", time.Now().Unix())

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
		"callback_url":   "https://yourwebsite.com/api/callback",
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
                  onClick={() =>
                    copyToClipboard(
                      `curl -X POST ${baseUrl}/api/v1/h2h/transaction \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "username": "YOUR_API_KEY",\n    "buyer_sku_code": "MLBB_86",\n    "customer_no": "12345678(2001)",\n    "ref_id": "INV-20260901-001",\n    "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",\n    "testing": false,\n    "callback_url": "https://yourwebsite.com/api/callback"\n  }'\n`,
                      "code-curl"
                    )
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {copiedId === "code-curl" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}{" "}
                  Salin Kode
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
{`curl -X POST ${baseUrl}/api/v1/h2h/transaction \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "YOUR_API_KEY",
    "buyer_sku_code": "MLBB_86",
    "customer_no": "12345678(2001)",
    "ref_id": "INV-20260901-001",
    "sign": "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
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
