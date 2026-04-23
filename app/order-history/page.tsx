"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Search, Package, Clock, CheckCircle, XCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Order {
  id: string;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getStatusStyles = (status: string) => {
  const s = status ? status.toLowerCase() : "pending";
  if (s === "paid" || s === "success") return { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle size={14} />, label: "Berhasil" };
  if (s === "pending") return { color: "text-yellow-600", bg: "bg-yellow-50", icon: <Clock size={14} />, label: "Menunggu" };
  return { color: "text-red-600", bg: "bg-red-50", icon: <XCircle size={14} />, label: "Gagal" };
};

export default function OrderHistoryPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Try to auto-search if phone exists in localStorage
    const savedPhone = localStorage.getItem("sweetmelt_customer_phone");
    if (savedPhone) {
      setPhone(savedPhone);
      handleSearch(savedPhone);
    }
  }, []);

  const handleSearch = async (phoneToSearch = phone) => {
    if (!phoneToSearch) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, total_price, status, created_at")
        .eq("customer_phone", phoneToSearch.trim().replace(/\s|-/g, ""))
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      if (error) console.error(error);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-oreo-white">
      <Navbar />

      <div className="bg-oreo-black pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/menu" className="inline-flex items-center gap-2 text-oreo-white/50 hover:text-oreo-white mb-6 transition-colors text-sm">
            <ArrowLeft size={15} /> Kembali ke Menu
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-oreo-white mb-4">
            Riwayat <span className="italic text-oreo-cream">Pesanan</span>
          </h1>
          <p className="text-oreo-white/60 max-w-md mx-auto text-sm leading-relaxed">
            Lacak pesananmu dengan memasukan nomor WhatsApp yang kamu gunakan saat checkout.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-10 mb-20 relative z-10">
        {/* Search Box */}
        <div className="bg-oreo-white border border-oreo-light rounded-3xl p-6 shadow-oreo-lg mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-oreo-black/50 text-xs font-bold uppercase tracking-wide block mb-1.5">Nomor WhatsApp</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Contoh: 08123456789" 
                  className="input-field pl-12" 
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-oreo-black/30" size={18} />
              </div>
            </div>
            <button 
              onClick={() => handleSearch()}
              disabled={loading || !phone}
              className={`w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                phone && !loading ? "bg-oreo-black text-oreo-white hover:bg-oreo-gray shadow-oreo" : "bg-oreo-light text-oreo-black/30 cursor-not-allowed"
              }`}
            >
              {loading ? "Mencari..." : "Lihat Riwayat Pesanan"}
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-10 h-10 border-4 border-oreo-black border-t-transparent rounded-full animate-spin" />
            <p className="text-oreo-black/50 text-sm font-medium">Memuat pesanan...</p>
          </div>
        ) : searched ? (
          orders.length > 0 ? (
            <div className="space-y-4 animate-fade-in">
              <p className="text-oreo-black/40 text-[10px] font-bold uppercase tracking-widest pl-2">
                Ditemukan {orders.length} Pesanan
              </p>
              {orders.map((order) => {
                const styles = getStatusStyles(order.status);
                return (
                  <Link 
                    key={order.id}
                    href={`/order/${order.id}`}
                    className="flex items-center justify-between bg-oreo-white border border-oreo-light rounded-2xl p-5 shadow-oreo hover:shadow-oreo-md hover:border-oreo-black/20 hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-oreo-cream flex items-center justify-center text-oreo-black/40">
                        <Package size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-oreo-black">
                            #{order.id.split("-")[0].toUpperCase()}
                          </span>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.bg} ${styles.color}`}>
                            {styles.icon}
                            {styles.label}
                          </div>
                        </div>
                        <p className="text-oreo-black font-bold text-sm">
                          {formatPrice(order.total_price)}
                        </p>
                        <p className="text-oreo-black/40 text-[10px]">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-oreo-black/20 group-hover:text-oreo-black transition-colors" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-5xl mb-4 opacity-20">📦</div>
              <h3 className="text-oreo-black font-bold">Tidak Ada Pesanan</h3>
              <p className="text-oreo-black/50 text-sm max-w-[250px] mx-auto mt-1">
                Belum ada pesanan dengan nomor ini. Yuk, mulai belanja dessert!
              </p>
              <Link href="/menu" className="btn-primary mt-6 inline-block">Mulai Pesan →</Link>
            </div>
          )
        ) : (
          <div className="text-center py-20 opacity-30">
            <Package size={48} className="mx-auto mb-4" />
            <p className="text-sm font-medium">Masukkan nomor untuk melihat riwayat</p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {searched && orders.length > 0 && (
        <div className="max-w-sm mx-auto text-center px-6 pb-20 opacity-40">
          <p className="text-xs leading-relaxed">
            Klik pada kartu pesanan untuk melihat detail nota dan konfirmasi WhatsApp.
          </p>
        </div>
      )}
    </main>
  );
}
