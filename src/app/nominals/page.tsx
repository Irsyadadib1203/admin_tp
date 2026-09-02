"use client";

import { useState } from "react";
import useSWR from "swr";
import { createPortal } from "react-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  ArrowRightLeft,
  Zap,
  Flame,
  Layers,
  Filter,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function NominalsPage() {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNominal, setEditingNominal] = useState<any | null>(null);

  // Selected items for bulk actions
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Switch Provider Modal state
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [switchTargetProvider, setSwitchTargetProvider] = useState<number>(1);
  const [switchScope, setSwitchScope] = useState<"game" | "selected">("game");
  const [switchGameId, setSwitchGameId] = useState<number>(1);
  const [isSwitching, setIsSwitching] = useState(false);

  // Switch Provider Result Modal state
  const [switchResult, setSwitchResult] = useState<{
    isOpen: boolean;
    totalRequested: number;
    switchedCount: number;
    skippedCount: number;
    skippedItems: string[];
    message: string;
    targetProviderName?: string;
  } | null>(null);

  // Confirm states
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    nominalId: number | null;
    nominalName: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    nominalId: null,
    nominalName: "",
    isLoading: false,
  });

  const [confirmEdit, setConfirmEdit] = useState<{
    isOpen: boolean;
    isLoading: boolean;
  }>({
    isOpen: false,
    isLoading: false,
  });

  const { data: games } = useSWR("/admin/games", fetcher);
  const { data: providers } = useSWR("/admin/providers", fetcher);
  const {
    data: nominals,
    mutate,
    isLoading,
  } = useSWR(
    `/admin/nominals?game_id=${selectedGame}&provider_id=${selectedProvider}&search=${search}`,
    fetcher
  );

  const [formData, setFormData] = useState({
    game_id: 1,
    provider_id: 1,
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
    kiosgamer_product_code: "",
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
      provider_id: providers && providers.length > 0 ? providers[0].id : 1,
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
      kiosgamer_product_code: "",
      seller_product_code: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingNominal(item);
    setFormData({
      game_id: item.game_id,
      provider_id: item.provider_id || (item.provider?.id ?? 1),
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
      kiosgamer_product_code: item.kiosgamer_product_code || "",
      seller_product_code: item.seller_product_code || item.provider_product_code,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNominal) {
      setConfirmEdit({ isOpen: true, isLoading: false });
    } else {
      executeSave();
    }
  };

  const executeSave = async () => {
    try {
      if (editingNominal) {
        setConfirmEdit((prev) => ({ ...prev, isLoading: true }));
        await api.put(`/admin/nominals/${editingNominal.id}`, formData);
        setConfirmEdit({ isOpen: false, isLoading: false });
      } else {
        await api.post("/admin/nominals", formData);
      }
      setIsModalOpen(false);
      mutate();
    } catch (err: any) {
      setConfirmEdit((prev) => ({ ...prev, isLoading: false }));
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const promptDelete = (id: number, name: string) => {
    setConfirmDelete({
      isOpen: true,
      nominalId: id,
      nominalName: name,
      isLoading: false,
    });
  };

  const executeDelete = async () => {
    if (!confirmDelete.nominalId) return;
    setConfirmDelete((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.delete(`/admin/nominals/${confirmDelete.nominalId}`);
      setConfirmDelete({ isOpen: false, nominalId: null, nominalName: "", isLoading: false });
      mutate();
    } catch (err: any) {
      setConfirmDelete((prev) => ({ ...prev, isLoading: false }));
      alert("Gagal menghapus: " + (err.response?.data?.message || err.message));
    }
  };

  // Open Switch Provider Modal
  const openSwitchProviderModal = (presetGameId?: number) => {
    if (presetGameId) {
      setSwitchGameId(presetGameId);
      setSwitchScope("game");
    } else if (selectedIds.length > 0) {
      setSwitchScope("selected");
    } else {
      setSwitchScope("game");
      if (selectedGame) {
        setSwitchGameId(parseInt(selectedGame));
      } else if (games && games.length > 0) {
        setSwitchGameId(games[0].id);
      }
    }

    if (providers && providers.length > 1) {
      // Pick first provider or opposite of current
      setSwitchTargetProvider(providers[0].id);
    }
    setIsSwitchModalOpen(true);
  };

  const executeSwitchProvider = async () => {
    if (!switchTargetProvider) return;
    setIsSwitching(true);
    try {
      let res;
      if (switchScope === "selected" && selectedIds.length > 0) {
        res = await api.post("/admin/nominals/batch-switch-provider", {
          nominal_ids: selectedIds,
          provider_id: switchTargetProvider,
        });
      } else {
        res = await api.post("/admin/nominals/batch-switch-provider", {
          game_id: switchGameId,
          provider_id: switchTargetProvider,
        });
      }
      setIsSwitchModalOpen(false);
      setSelectedIds([]);
      mutate();

      const resultData = res.data?.data;
      const targetProv = providers?.find((p: any) => p.id === switchTargetProvider);
      if (resultData) {
        setSwitchResult({
          isOpen: true,
          totalRequested: resultData.total_requested || 0,
          switchedCount: resultData.switched_count || 0,
          skippedCount: resultData.skipped_count || 0,
          skippedItems: resultData.skipped_items || [],
          message: res.data?.message || "Proses pemindahan provider selesai.",
          targetProviderName: targetProv ? `${targetProv.name} (${targetProv.code})` : "Provider Target",
        });
      }
    } catch (err: any) {
      alert("Gagal memindahkan provider: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSwitching(false);
    }
  };

  const toggleSelectAll = () => {
    if (!nominals) return;
    if (selectedIds.length === nominals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(nominals.map((n: any) => n.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getProviderBadge = (provider: any, providerId?: number) => {
    const code = provider?.code?.toUpperCase() || (providerId === 2 ? "KIOSGAMER" : "DIGIFLAZZ");
    if (code === "KIOSGAMER") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Flame className="w-3 h-3" />
          Kiosgamer
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 border border-sky-500/30 text-sky-400">
        <Zap className="w-3 h-3" />
        Digiflazz
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Nominal & Multi-Tier Pricing</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Atur harga jual, SKU, dan alokasi provider pemrosesan (Digiflazz / Kiosgamer)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch Provider Button */}
          <button
            onClick={() => openSwitchProviderModal()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Pindah Provider {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}</span>
          </button>

          {/* Create Nominal Button */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Nominal
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Game Filter */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Semua Game</option>
              {games?.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Provider Filter */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Semua Provider</option>
              {providers?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  Provider: {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari item / SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      nominals && nominals.length > 0 && selectedIds.length === nominals.length
                    }
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                  />
                </th>
                <th className="py-3.5 px-4">Game & Item</th>
                <th className="py-3.5 px-3">Provider</th>
                <th className="py-3.5 px-3">SKU Provider / Seller</th>
                <th className="py-3.5 px-3">Modal Dasar</th>
                <th className="py-3.5 px-3">Harga Publik</th>
                <th className="py-3.5 px-3">Harga Member</th>
                <th className="py-3.5 px-3">Reseller H2H</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nominals && nominals.length > 0 ? (
                nominals.map((item: any) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/20 transition-colors ${
                        isChecked ? "bg-indigo-950/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(item.id)}
                          className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="text-[10px] text-indigo-400 font-semibold block">
                            {item.game?.name || "Game ID #" + item.game_id}
                          </span>
                          <span className="font-semibold text-white text-xs sm:text-sm">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        {getProviderBadge(item.provider, item.provider_id)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            Prov: {item.provider_product_code}
                          </span>
                          <span className="text-amber-400 font-medium text-[11px]">
                            H2H: {item.seller_product_code || item.provider_product_code}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-slate-400">
                        {formatRupiah(item.base_price)}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-emerald-400">
                        {formatRupiah(item.price_public)}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-sky-400">
                        {formatRupiah(item.price_member)}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-amber-300">
                        {formatRupiah(item.price_reseller)}
                      </td>
                      <td className="py-3.5 px-3">
                        {item.is_active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                            <X className="w-3.5 h-3.5" /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Edit Nominal"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => promptDelete(item.id, item.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Hapus Nominal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    {isLoading ? "Memuat data nominal..." : "Belum ada nominal produk."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Nominal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {editingNominal
                    ? "Edit Nominal: " + editingNominal.name
                    : "Tambah Nominal Produk"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                {/* Game and Provider Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Pilih Game *</label>
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
                      Provider Pemrosesan *
                    </label>
                    <select
                      value={formData.provider_id}
                      onChange={(e) =>
                        setFormData({ ...formData, provider_id: parseInt(e.target.value) })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold text-indigo-300"
                    >
                      {providers?.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Nominal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 86 Diamonds / Free Fire 140 DM"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      SKU Digiflazz *
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
                    <label className="block text-amber-300 font-medium mb-1 flex items-center justify-between">
                      <span>SKU Kiosgamer</span>
                      <span className="text-[10px] text-slate-400">FF / CODM</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 1, 2, 14, 103"
                      value={formData.kiosgamer_product_code}
                      onChange={(e) =>
                        setFormData({ ...formData, kiosgamer_product_code: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-amber-300 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      SKU Seller (H2H)
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
                      <label className="block text-slate-400 mb-1">Harga Modal Dasar (Rp)</label>
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
                      <label className="block text-slate-400 mb-1">Markup Margin (%)</label>
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
          </div>,
          document.body
        )}

      {/* Modal Pindah / Switch Provider */}
      {isSwitchModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pindah Provider Produk</h3>
                  <p className="text-xs text-slate-400">
                    Alihkan pemrosesan produk ke Provider lain (Digiflazz &harr; Kiosgamer)
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs pt-2">
                {/* Scope Selection */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Metode Pemindahan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSwitchScope("game")}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        switchScope === "game"
                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      Berdasarkan Game
                    </button>
                    <button
                      type="button"
                      onClick={() => setSwitchScope("selected")}
                      disabled={selectedIds.length === 0}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        switchScope === "selected"
                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 disabled:opacity-40"
                      }`}
                    >
                      Item Terpilih ({selectedIds.length})
                    </button>
                  </div>
                </div>

                {switchScope === "game" && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Pilih Game Target
                    </label>
                    <select
                      value={switchGameId}
                      onChange={(e) => setSwitchGameId(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {games?.map((g: any) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Pindahkan ke Provider Tujuan *
                  </label>
                  <select
                    value={switchTargetProvider}
                    onChange={(e) => setSwitchTargetProvider(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-bold text-amber-300"
                  >
                    {providers?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                  Semua transaksi mendatang untuk item yang dialihkan akan langsung diproses
                  melalui provider yang dipilih.
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSwitchModalOpen(false)}
                  disabled={isSwitching}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={executeSwitchProvider}
                  disabled={isSwitching}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {isSwitching ? "Memindahkan..." : "Terapkan Pemindahan"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Confirmation Modal - Delete Nominal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() =>
          setConfirmDelete({ isOpen: false, nominalId: null, nominalName: "", isLoading: false })
        }
        onConfirm={executeDelete}
        title="Hapus Nominal Item?"
        message={
          <>
            Apakah Anda yakin ingin menghapus item nominal{" "}
            <strong className="text-white font-semibold">{confirmDelete.nominalName}</strong>?
          </>
        }
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={confirmDelete.isLoading}
      />

      {/* Modal Laporan Hasil Pemindahan Provider */}
      {switchResult?.isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    switchResult.skippedCount === 0
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : switchResult.switchedCount > 0
                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                  }`}
                >
                  {switchResult.skippedCount === 0 ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : switchResult.switchedCount > 0 ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white">
                    {switchResult.skippedCount === 0
                      ? "Pemindahan Provider Berhasil"
                      : switchResult.switchedCount > 0
                      ? "Pemindahan Sebagian & Fallback Otomatis"
                      : "Pemindahan Provider Dibatalkan"}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {switchResult.message}
                  </p>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Total Diproses</span>
                  <span className="font-bold text-slate-200 text-sm">{switchResult.totalRequested}</span>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-xl">
                  <span className="text-[10px] text-emerald-400 block font-medium">Dialihkan</span>
                  <span className="font-bold text-emerald-400 text-sm">+{switchResult.switchedCount}</span>
                </div>
                <div className="bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-xl">
                  <span className="text-[10px] text-amber-400 block font-medium">Fallback (Tetap)</span>
                  <span className="font-bold text-amber-400 text-sm">{switchResult.skippedCount}</span>
                </div>
              </div>

              {/* Fallback Details List if any */}
              {switchResult.skippedItems && switchResult.skippedItems.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    <Info className="w-3.5 h-3.5" />
                    <span>Daftar Nominal yang Tetap di Provider Lama:</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-[11px] custom-scrollbar">
                    {switchResult.skippedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-amber-400 font-bold">•</span>
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    💡 Nominal di atas tetap aktif dan aman melayani transaksi melalui provider sebelumnya.
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSwitchResult(null)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Tutup & Selesai
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Confirmation Modal - Edit Nominal */}
      <ConfirmModal
        isOpen={confirmEdit.isOpen}
        onClose={() => setConfirmEdit({ isOpen: false, isLoading: false })}
        onConfirm={executeSave}
        title="Simpan Perubahan Harga & Nominal?"
        message={
          <>
            Apakah Anda yakin ingin memperbarui konfigurasi harga, provider, dan SKU untuk{" "}
            <strong className="text-white font-semibold">{formData.name}</strong>?
          </>
        }
        confirmText="Ya, Simpan"
        cancelText="Periksa Lagi"
        variant="primary"
        isLoading={confirmEdit.isLoading}
      />
    </div>
  );
}
