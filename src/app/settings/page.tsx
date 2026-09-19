"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Shield,
  Server,
  RefreshCw,
  Eye,
  User,
  Lock,
  Save,
  KeyRound,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function SettingsPage() {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // ─── Profile form ───────────────────────────────────────────────────────────
  const { data: profile, mutate: mutateProfile } = useSWR("/admin/me", (url) =>
    api.get(url).then((res) => res.data.data)
  );

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone_number: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setProfileMsg(null);
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileMsg({ type: "error", text: "Nama dan Email tidak boleh kosong." });
      return;
    }
    setSavingProfile(true);
    try {
      await api.put("/admin/me", profileForm);
      await mutateProfile();
      setProfileMsg({ type: "success", text: "Profil berhasil diperbarui!" });
    } catch (err: any) {
      setProfileMsg({
        type: "error",
        text: err?.response?.data?.message || "Gagal memperbarui profil.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // ─── Change password form ────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (!pwForm.current_password || !pwForm.new_password || !pwForm.confirm_password) {
      setPwMsg({ type: "error", text: "Semua field password wajib diisi." });
      return;
    }
    if (pwForm.new_password.length < 6) {
      setPwMsg({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwMsg({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }
    setSavingPw(true);
    try {
      await api.put("/admin/me/change-password", {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      setPwMsg({ type: "success", text: "Password berhasil diubah!" });
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      setPwMsg({
        type: "error",
        text: err?.response?.data?.message || "Gagal mengubah password.",
      });
    } finally {
      setSavingPw(false);
    }
  };

  // ─── Webhook logs ────────────────────────────────────────────────────────────
  const { data: webhookLogs, mutate, isLoading } = useSWR(
    "/admin/webhooks/logs",
    fetcher
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Pengaturan</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Kelola profil akun admin, keamanan, dan log sistem.
        </p>
      </div>

      {/* ── Profile & Password ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Edit Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Profil Akun</h3>
              <p className="text-[11px] text-slate-400">Ubah nama tampilan dan alamat email login</p>
            </div>
          </div>

          {profileMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                profileMsg.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              {profileMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nama Admin"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Email (Username Login)
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@irxplay.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={profileForm.phone_number}
                onChange={(e) => setProfileForm((f) => ({ ...f, phone_number: e.target.value }))}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {profile && (
              <span className="text-[11px] text-slate-500">
                Role: <span className="text-indigo-400 font-semibold uppercase">{profile.role}</span>
              </span>
            )}
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              {savingProfile ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Simpan Profil
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ubah Password</h3>
              <p className="text-[11px] text-slate-400">Gunakan password kuat minimal 6 karakter</p>
            </div>
          </div>

          {pwMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                pwMsg.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              {pwMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{pwMsg.text}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Password Lama
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={pwForm.current_password}
                  onChange={(e) => setPwForm((f) => ({ ...f, current_password: e.target.value }))}
                  placeholder="Password saat ini"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type={showNew ? "text" : "password"}
                  value={pwForm.new_password}
                  onChange={(e) => setPwForm((f) => ({ ...f, new_password: e.target.value }))}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="password"
                  value={pwForm.confirm_password}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirm_password: e.target.value }))}
                  placeholder="Ulangi password baru"
                  className={`w-full bg-slate-950 border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                    pwForm.confirm_password && pwForm.new_password !== pwForm.confirm_password
                      ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30"
                      : "border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                  }`}
                />
              </div>
              {pwForm.confirm_password && pwForm.new_password !== pwForm.confirm_password && (
                <p className="text-[11px] text-rose-400 mt-1">Password tidak cocok</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleChangePassword}
              disabled={savingPw}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              {savingPw ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Shield className="w-3.5 h-3.5" />
              )}
              Ubah Password
            </button>
          </div>
        </div>
      </div>

      {/* System Status Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-slate-400 font-medium">Backend Engine</span>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
            <Server className="w-4 h-4" /> Go (Golang)
          </p>
          <p className="text-[11px] text-slate-500">Port 8080 • Gin Framework</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-slate-400 font-medium">Admin Interface</span>
          <p className="text-sm font-bold text-indigo-400">Next.js 14 (App Router)</p>
          <p className="text-[11px] text-slate-500">Tailwind CSS</p>
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
