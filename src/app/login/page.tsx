"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { setAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data.data;

      // Check admin permissions
      if (
        user.role !== "admin" &&
        user.role !== "superadmin" &&
        user.role !== "operator"
      ) {
        setError("Akun Anda tidak memiliki izin akses Admin Panel.");
        setLoading(false);
        return;
      }

      setAuthSession(token, user);
      router.push("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Gagal masuk. Silakan periksa email dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 mb-3 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="IRXPLAY Logo"
              width={56}
              height={56}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-white">
            IRX<span className="text-indigo-400">PLAY</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Admin Dashboard Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@topup.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Panel Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Default Superadmin: <span className="text-slate-400">admin@topup.com</span> /{" "}
          <span className="text-slate-400">admin123</span>
        </div>
      </div>
    </div>
  );
}
