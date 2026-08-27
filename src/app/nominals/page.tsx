"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Edit2, Trash2, Search, Zap, Check, X } from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function NominalsPage() {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNominal, setEditingNominal] = useState<any | null>(null);

  const { data: games } = useSWR("/admin/games", fetcher);
  const { data: nominals, mutate, isLoading } = useSWR(
    `/admin/nominals?game_id=${selectedGame}&search=${search}`,
    fetcher
  );

  const [formData, setFormData] = useState({
    game_id: 1,
    name: "",
    description: "",
    base_price: 10000,
    margin_percent: 8,
    margin_flat: 0,
    price_public: 10800,
    price_member: 10600,
    price_vip: 10400,
    price_reseller: 10200,
    provider_product_code: "",
    seller_product_code: "",
    is_active: true,
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleBasePriceOrMarginChange = (base: number, marginPct: number) => {
    const margin = base * (marginPct / 100);
    setFormData((prev) => ({
      ...prev,
      base_price: base,
      margin_percent: marginPct,
      price_public: Math.round(base + margin),
      price_member: Math.round(base + margin * 0.85),
      price_vip: Math.round(base + margin * 0.7),
      price_reseller: Math.round(base + margin * 0.5),
    }));
  };

  const openCreateModal = () => {
    setEditingNominal(null);
    setFormData({
      game_id: games && games.length > 0 ? games[0].id : 1,
      name: "",
      description: "Proses instan 1-3 detik",
      base_price: 10000,
      margin_percent: 8,
      margin_flat: 0,
      price_public: 10800,
      price_member: 10600,
      price_vip: 10400,
      price_reseller: 10200,
      provider_product_code: "",
      seller_product_code: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingNominal(item);
    setFormData({
      game_id: item.game_id,
      name: item.name,
      description: item.description || "",
      base_price: item.base_price,
      margin_percent: item.margin_percent,
      margin_flat: item.margin_flat || 0,
      price_public: item.price_public,
      price_member: item.price_member,
      price_vip: item.price_vip,
      price_reseller: item.price_reseller,
      provider_product_code: item.provider_product_code,
      seller_product_code: item.seller_product_code || item.provider_product_code,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNominal) {
        await api.put(`/admin/nominals/${editingNominal.id}`, formData);
      } else {
        await api.post("/admin/nominals", formData);
      }
      setIsModalOpen(false);
      mutate();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus nominal ${name}?`)) return;
    try {
      await api.delete(`/admin/nominals/${id}`);
      mutate();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Nominal & Multi-Tier Pricing</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Atur harga jual ke Publik, Member, VIP, dan Reseller H2H Digiflazz
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Game Filter */}
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Semua Game</option>
            {games?.map((g: any) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari item / SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Nominal
          </button>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3.5 px-5">Game & Item</th>
                <th className="py-3.5 px-4">SKU Provider / Seller</th>
                <th className="py-3.5 px-4">Modal Dasar</th>
                <th className="py-3.5 px-4">Harga Publik</th>
                <th className="py-3.5 px-4">Harga Member</th>
                <th className="py-3.5 px-4">Reseller H2H</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nominals && nominals.length > 0 ? (
                nominals.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-5">
                      <div>
                        <span className="text-[10px] text-indigo-400 font-semibold block">
                          {item.game?.name || "Game ID #" + item.game_id}
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          Prov: {item.provider_product_code}
                        </span>
                        <span className="text-amber-400 font-medium">
                          H2H: {item.seller_product_code || item.provider_product_code}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-400">
                      {formatRupiah(item.base_price)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">
                      {formatRupiah(item.price_public)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-sky-400">
                      {formatRupiah(item.price_member)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-amber-300">
                      {formatRupiah(item.price_reseller)}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <Check className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <X className="w-3.5 h-3.5" /> Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    {isLoading ? "Memuat data nominal..." : "Belum ada nominal produk."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Nominal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingNominal ? "Edit Nominal Produk" : "Tambah Nominal Produk"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Pilih Game *
                  </label>
                  <select
                    value={formData.game_id}
                    onChange={(e) =>
                      setFormData({ ...formData, game_id: parseInt(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {games?.map((g: any) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nama Nominal *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 86 Diamonds"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    SKU Provider (Digiflazz) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ML86 / FF140"
                    value={formData.provider_product_code}
                    onChange={(e) =>
                      setFormData({ ...formData, provider_product_code: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    SKU Seller (Open API H2H)
                  </label>
                  <input
                    type="text"
                    placeholder="MLBB_86"
                    value={formData.seller_product_code}
                    onChange={(e) =>
                      setFormData({ ...formData, seller_product_code: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Pricing Calculation Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-indigo-400">
                  Kalkulasi Harga & Margin Bertingkat
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Harga Modal Dasar (Rp)
                    </label>
                    <input
                      type="number"
                      value={formData.base_price}
                      onChange={(e) =>
                        handleBasePriceOrMarginChange(
                          parseFloat(e.target.value) || 0,
                          formData.margin_percent
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-slate-100 focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Markup Margin (%)
                    </label>
                    <input
                      type="number"
                      value={formData.margin_percent}
                      onChange={(e) =>
                        handleBasePriceOrMarginChange(
                          formData.base_price,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-slate-100 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-900 p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Publik</span>
                    <span className="font-bold text-emerald-400 text-xs">
                      {formatRupiah(formData.price_public)}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Member</span>
                    <span className="font-bold text-sky-400 text-xs">
                      {formatRupiah(formData.price_member)}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">VIP</span>
                    <span className="font-bold text-violet-400 text-xs">
                      {formatRupiah(formData.price_vip)}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Reseller H2H</span>
                    <span className="font-bold text-amber-300 text-xs">
                      {formatRupiah(formData.price_reseller)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nom_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600"
                />
                <label htmlFor="nom_active" className="text-slate-300 font-medium cursor-pointer">
                  Aktifkan item ini untuk dijual
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  {editingNominal ? "Simpan Perubahan" : "Buat Nominal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
