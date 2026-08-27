"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Gamepad2,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Games",
    publisher: "",
    description: "",
    image_url: "",
    banner_url: "",
    is_active: true,
    is_popular: false,
    has_zone_id: false,
    user_id_label: "User ID",
    zone_id_label: "Zone ID / Server",
    nickname_check_code: "MOBILE_LEGENDS",
  });

  const { data: games, mutate, isLoading } = useSWR(
    `/admin/games?search=${search}`,
    fetcher
  );

  const openCreateModal = () => {
    setEditingGame(null);
    setFormData({
      name: "",
      slug: "",
      category: "Games",
      publisher: "",
      description: "",
      image_url: "",
      banner_url: "",
      is_active: true,
      is_popular: false,
      has_zone_id: false,
      user_id_label: "User ID",
      zone_id_label: "Zone ID / Server",
      nickname_check_code: "MOBILE_LEGENDS",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (game: any) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      slug: game.slug,
      category: game.category,
      publisher: game.publisher || "",
      description: game.description || "",
      image_url: game.image_url || "",
      banner_url: game.banner_url || "",
      is_active: game.is_active,
      is_popular: game.is_popular,
      has_zone_id: game.has_zone_id,
      user_id_label: game.user_id_label || "User ID",
      zone_id_label: game.zone_id_label || "Zone ID / Server",
      nickname_check_code: game.nickname_check_code || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGame) {
        await api.put(`/admin/games/${editingGame.id}`, formData);
      } else {
        await api.post("/admin/games", formData);
      }
      setIsModalOpen(false);
      mutate();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus game ${name}? Semua nominal terkait juga akan dihapus.`))
      return;
    try {
      await api.delete(`/admin/games/${id}`);
      mutate();
    } catch (err: any) {
      alert("Gagal menghapus game: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Manajemen Game & Produk</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar game yang aktif dijual pada website top-up Anda
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari game..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Game
          </button>
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3.5 px-5">Game</th>
                <th className="py-3.5 px-4">Kategori & Publisher</th>
                <th className="py-3.5 px-4">Cek Nickname</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Populer</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {games && games.length > 0 ? (
                games.map((g: any) => (
                  <tr key={g.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {g.image_url ? (
                            <img
                              src={g.image_url}
                              alt={g.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Gamepad2 className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{g.name}</p>
                          <p className="text-[11px] text-slate-500">/{g.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium mr-1.5">
                        {g.category}
                      </span>
                      <span className="text-slate-400">{g.publisher || "-"}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {g.nickname_check_code ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                          {g.nickname_check_code}
                        </span>
                      ) : (
                        <span className="text-slate-500">Nonaktif</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {g.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <Check className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <X className="w-3.5 h-3.5" /> Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {g.is_popular ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                          <Sparkles className="w-3.5 h-3.5" /> Ya
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(g)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit Game"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(g.id, g.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Hapus Game"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    {isLoading ? "Memuat katalog game..." : "Tidak ada game yang ditemukan."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Game */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingGame ? "Edit Game" : "Tambah Game Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Game *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mobile Legends: Bang Bang"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Games">Games</option>
                    <option value="Voucher">Voucher</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Pulsa & PLN">Pulsa & PLN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    placeholder="Moonton / Garena"
                    value={formData.publisher}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  URL Gambar Thumbnail
                </label>
                <input
                  type="text"
                  placeholder="https://.../mlbb.jpg"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-slate-300">
                  Konfigurasi Validasi Nickname
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Checker Engine</label>
                    <select
                      value={formData.nickname_check_code}
                      onChange={(e) =>
                        setFormData({ ...formData, nickname_check_code: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2.5 text-slate-200 focus:outline-none"
                    >
                      <option value="">(Nonaktifkan)</option>
                      <option value="MOBILE_LEGENDS">Mobile Legends (ID + Zone)</option>
                      <option value="FREE_FIRE">Free Fire (User ID)</option>
                      <option value="GENSHIN_IMPACT">Genshin Impact (UID)</option>
                      <option value="PUBG_MOBILE">PUBG Mobile</option>
                      <option value="VALORANT">Valorant (Riot ID)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Perlu Server / Zone ID?</label>
                    <select
                      value={formData.has_zone_id ? "true" : "false"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          has_zone_id: e.target.value === "true",
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2.5 text-slate-200 focus:outline-none"
                    >
                      <option value="false">Tidak (Hanya User ID)</option>
                      <option value="true">Ya (Perlu Zone / Server ID)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600"
                  />
                  <span className="text-slate-300 font-medium">Aktifkan Game</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) =>
                      setFormData({ ...formData, is_popular: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600"
                  />
                  <span className="text-slate-300 font-medium">Tampilkan di Populer</span>
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
                  {editingGame ? "Simpan Perubahan" : "Buat Game"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
