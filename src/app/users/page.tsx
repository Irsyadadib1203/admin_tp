"use client";

import { useState } from "react";
import useSWR from "swr";
import { Users, Plus, Edit2, Key, Wallet, Shield, Check, X } from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const { data: users, mutate, isLoading } = useSWR(
    `/admin/users?role=${roleFilter}`,
    fetcher
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "member",
    tier: "member",
    balance_adjustment: 0,
    adjustment_reason: "Penyesuaian saldo admin",
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone_number: user.phone_number || "",
      role: user.role,
      tier: user.tier,
      balance_adjustment: 0,
      adjustment_reason: "Penyesuaian saldo admin",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${selectedUser.id}`, {
        name: formData.name,
        role: formData.role,
        tier: formData.tier,
        balance_adjustment: formData.balance_adjustment,
        adjustment_reason: formData.adjustment_reason,
      });
      setIsEditModalOpen(false);
      mutate();
    } catch (err: any) {
      alert("Gagal update user: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", formData);
      setIsCreateModalOpen(false);
      mutate();
    } catch (err: any) {
      alert("Gagal tambah user: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            Pengguna & Akun Reseller Mitra
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola peran hak akses (Admin/Operator), Tier Harga (VIP/Reseller), dan Saldo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Semua Peran</option>
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="reseller">Reseller H2H</option>
            <option value="member">Member</option>
          </select>

          <button
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                password: "",
                phone_number: "",
                role: "member",
                tier: "member",
                balance_adjustment: 0,
                adjustment_reason: "",
              });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
              <th className="py-3.5 px-5">Pengguna</th>
              <th className="py-3.5 px-4">Role & Akses</th>
              <th className="py-3.5 px-4">Tier Harga</th>
              <th className="py-3.5 px-4">Saldo Akun</th>
              <th className="py-3.5 px-4">API Key H2H</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users && users.length > 0 ? (
              users.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-5">
                    <div>
                      <span className="font-semibold text-white text-sm block">
                        {u.name}
                      </span>
                      <span className="text-slate-400 text-[11px] block">{u.email}</span>
                      {u.phone_number && (
                        <span className="text-slate-500 text-[10px]">
                          {u.phone_number}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === "superadmin"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : u.role === "admin"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : u.role === "reseller"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-indigo-300 uppercase">
                      {u.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">
                    {formatRupiah(u.balance)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    {u.api_key ? (
                      <span className="text-amber-400 font-semibold">
                        {u.api_key.key}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit User & Saldo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  {isLoading ? "Memuat pengguna..." : "Tidak ada pengguna."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit User & Balance */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              Edit Pengguna & Saldo: {selectedUser.name}
            </h3>

            <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Role Akun
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="reseller">Reseller H2H</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Tier Harga
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                  >
                    <option value="public">Publik</option>
                    <option value="member">Member</option>
                    <option value="vip">VIP</option>
                    <option value="reseller">Reseller H2H</option>
                  </select>
                </div>
              </div>

              {/* Balance Adjustment Section */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold text-amber-400 block">
                  Penyesuaian Saldo Akun (Saat ini: {formatRupiah(selectedUser.balance)})
                </span>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Tambah (+) atau Kurang (-) Saldo Rp
                  </label>
                  <input
                    type="number"
                    value={formData.balance_adjustment}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        balance_adjustment: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-slate-100 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Keterangan Mutasi
                  </label>
                  <input
                    type="text"
                    value={formData.adjustment_reason}
                    onChange={(e) =>
                      setFormData({ ...formData, adjustment_reason: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create User */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Tambah Pengguna Baru</h3>
            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Role Akun
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="reseller">Reseller H2H</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Tier Harga
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                  >
                    <option value="public">Publik</option>
                    <option value="member">Member</option>
                    <option value="vip">VIP</option>
                    <option value="reseller">Reseller H2H</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Buat Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
