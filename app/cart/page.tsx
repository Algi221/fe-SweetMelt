"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/cartStore";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, Phone, ChevronRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

const sanitizeImageUrl = (url: string) => {
  if (!url) return "";
  return url
    .replace("/images/pudingCoklat/", "/images/puding/")
    .replace("/images/pudingStrawberry/", "/images/puding/");
};

function isValidPhone(phone: string) {
  return /^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(phone.replace(/\s|-/g, ""));
}

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const router = useRouter();
  
  // Basic Info Form
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  
  // PO Fields - Fixed
  const pickupTime = "Selasa, 17 Maret 2026 (Day-1)";
  const pickupLocation = "Di antar ke rumah";
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("midtrans"); // "midtrans" or "cash"
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const subtotal = total();
  const canOrder = items.length > 0 && form.name && form.phone && form.address && coords;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "phone") { setPhoneError(""); }
  };

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address) { setError("Semua field wajib diisi"); return; }
    if (!coords) { setError("Mohon tentukan lokasi di peta agar kurir mudah menemukan rumahmu!"); return; }
    if (!isValidPhone(form.phone)) { setError("Format nomor HP tidak valid!"); return; }
    
    setSubmitting(true); setError("");
    try {
      const mapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
      const finalAddress = `${form.address} \n\nMaps: ${mapsUrl}`;

      // 1. Simpan Order ke Supabase
      const { data: orderData, error: orderErr } = await supabase.from('orders').insert({
          customer_name: form.name, 
          customer_phone: form.phone, 
          customer_address: finalAddress, 
          pickup_time: pickupTime,
          pickup_location: pickupLocation,
          payment_method: paymentMethod,
          notes: form.notes,
          total_price: subtotal,
          status: 'pending'
      }).select().single();

      if (orderErr || !orderData) throw new Error(orderErr?.message || "Gagal membuat order");
      
      const orderId = orderData.id;

      // 2. Simpan Order Items ke Supabase
      const orderItems = items.map((i) => ({
        order_id: orderId,
        product_id: i.id,
        product_name: i.variant ? `${i.name} (${i.variant})` : i.name,
        quantity: i.quantity,
        price_at_order: i.price
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw new Error("Gagal menyimpan item pesanan");

      // Save full order to localStorage for fast local history
      const orderToStore = {
        id: orderId,
        items: [...items],
        total: subtotal,
        date: new Date().toISOString(),
        status: 'pending',
        customer: { name: form.name, phone: form.phone, address: form.address }
      };
      const prevOrders = JSON.parse(localStorage.getItem("sweetmelt_recent_orders") || "[]");
      localStorage.setItem("sweetmelt_recent_orders", JSON.stringify([orderToStore, ...prevOrders]));

      localStorage.setItem("sweetmelt_customer_phone", form.phone);
      localStorage.setItem("sweetmelt_customer_name", form.name);

      clearCart();

      // If Cash, just go to order page.
      // If Cash, notify telegram then just go to order page.
      if (paymentMethod === "cash") {
        try {
          await supabase.functions.invoke('telegram-notify', {
            body: { 
              message: `
💵 <b>Pesanan Baru (COD/Tunai)!</b> 💵

<b>Pelanggan:</b> ${form.name}
<b>No. WhatsApp:</b> ${form.phone}
<b>Total:</b> ${formatPrice(subtotal)}
<b>Status:</b> BELUM BAYAR (Tunai)

<b>Alamat:</b> ${form.address}
              `.trim()
            }
          });
        } catch (err) { console.error("Notify failed", err); }
        
        router.push(`/order/${orderId}`);
        return;
      }

      // 3. Panggil Edge Function untuk Midtrans Payment URL
      const { data: payData, error: payErr } = await supabase.functions.invoke('create-payment', {
        body: { 
          order_id: orderId,
          frontend_url: window.location.origin // Dynamic URL for redirects
        }
      });
      
      if (payErr || !payData?.paymentUrl) { 
        router.push(`/order/${orderId}`); 
        return; 
      }
      
      // Auto redirect ke web payment midtrans
      window.location.href = payData.paymentUrl;
    } catch (e: any) { setError(e.message || "Terjadi kesalahan, coba lagi."); }
    finally { setSubmitting(false); }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-oreo-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
          <span className="text-8xl animate-float">🛒</span>
          <div>
            <h2 className="font-display text-3xl text-oreo-black mb-2">Keranjangmu Kosong</h2>
            <p className="text-oreo-black/50 mb-8">Yuk, tambah dessert favoritmu dulu!</p>
          </div>
          <Link href="/menu" className="btn-primary">Lihat Menu →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-oreo-white pb-16">
      <Navbar />
      <div className="bg-oreo-black pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/menu" className="inline-flex items-center gap-2 text-oreo-white/50 hover:text-oreo-white mb-6 transition-colors text-sm">
            <ArrowLeft size={15} /> Lanjut Belanja
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-oreo-white">
            Pre-Order & <span className="italic text-oreo-cream">Checkout</span>
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Cart items — 3 cols */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-lumer/10 border border-lumer/20 rounded-2xl p-6 mb-6 flex items-start gap-4">
               <div className="bg-lumer text-oreo-white p-2.5 rounded-xl shadow-sm">
                  <CheckCircle size={20} />
               </div>
               <div>
                  <h3 className="text-oreo-black font-bold text-lg mb-1">Informasi Pengiriman PO</h3>
                  <p className="text-oreo-black/60 text-sm leading-relaxed">
                    Semua pesanan akan <span className="font-bold text-oreo-black">langsung di antar ke rumah</span> pada hari <span className="text-lumer font-bold uppercase underline decoration-2 underline-offset-4">Selasa, 17 Maret 2026</span>. Gak perlu ribet ambil sendiri!
                  </p>
               </div>
            </div>

            <p className="text-oreo-black/40 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <ShoppingBag size={13} /> Item ({items.length})
            </p>
            {items.map((item) => (
              <div key={`${item.id}-${item.variant}`} className="flex items-center gap-4 bg-oreo-white border border-oreo-light rounded-2xl p-4 shadow-oreo">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-oreo-cream">
                  <img src={sanitizeImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-oreo-black font-medium truncate">{item.name}</p>
                    {item.variant && (
                      <span className="px-2 py-0.5 rounded-md bg-oreo-cream text-oreo-black/60 text-[10px] font-bold uppercase tracking-wider">
                        {item.variant}
                      </span>
                    )}
                  </div>
                  <p className="text-oreo-black/60 text-sm font-bold">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.quantity - 1, item.variant)} className="w-7 h-7 rounded-full border border-oreo-light text-oreo-black/50 hover:border-oreo-black hover:text-oreo-black flex items-center justify-center transition-all">
                    <Minus size={12} />
                  </button>
                  <span className="text-oreo-black w-5 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1, item.variant)} className="w-7 h-7 rounded-full bg-oreo-black text-oreo-white hover:bg-oreo-gray flex items-center justify-center transition-all">
                    <Plus size={12} />
                  </button>
                </div>
                <p className="text-oreo-black font-semibold text-sm w-20 text-right">{formatPrice(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.id, item.variant)} className="text-oreo-black/20 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            
            {/* Leaflet Map Section */}
            <div className="mt-8 bg-oreo-white border border-oreo-light rounded-2xl overflow-hidden shadow-oreo">
              <div className="p-6">
                <h3 className="font-display text-xl text-oreo-black mb-2">Tandai Lokasi Rumahmu 📍</h3>
                <p className="text-oreo-black/50 text-xs mb-6 lowercase">Klik pada peta untuk menetapkan titik pengantaran agar kurir tidak nyasar</p>
                
                <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-oreo-light bg-oreo-cream relative group z-0">
                  <LeafletMapWidget onSelect={setCoords} />
                  {coords && (
                    <div className="absolute bottom-4 left-4 right-4 bg-oreo-black text-oreo-white p-3 rounded-xl text-xs font-medium animate-fade-in shadow-lg z-[1000]">
                      ✅ Titik lokasi berhasil ditandai!
                    </div>
                  )}
                  {!coords && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none group-hover:bg-transparent transition-colors z-[1000]">
                      <p className="bg-oreo-white/90 backdrop-blur px-6 py-3 rounded-full text-oreo-black font-bold text-sm shadow-xl border border-oreo-light">
                        Klik Peta Untuk Pasang Pin
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Checkout form — 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-oreo-white border border-oreo-light rounded-2xl p-6 sticky top-8 shadow-oreo">
              <h2 className="font-display text-xl text-oreo-black mb-6">Data Pemesan</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-oreo-black/50 text-xs font-bold uppercase tracking-wide block mb-1.5">Nama Lengkap</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Nama kamu" className="input-field" />
                </div>
                {/* Phone */}
                <div>
                  <label className="text-oreo-black/50 text-xs font-bold uppercase tracking-wide block mb-1.5">Nomor WhatsApp</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="08123456789"
                    className={`input-field ${phoneError ? "border-red-400" : ""}`} />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>

                <div>
                  <label className="text-oreo-black/50 text-xs font-bold uppercase tracking-wide block mb-1.5">Alamat Lengkap & Patokan</label>
                  <textarea name="address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Contoh: Jl. Mangga No. 5, Rumah pagar hitam sebelah warung nasi..." rows={3} className="input-field resize-none" />
                </div>
                <div>
                  <label className="text-oreo-black/50 text-xs font-bold uppercase tracking-wide block mb-1.5">Catatan (opsional)</label>
                  <input name="notes" value={form.notes} onChange={handleChange} placeholder="Contoh: Titip di satpam ya..." className="input-field" />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mt-6 border-t border-oreo-light pt-6">
                <label className="text-oreo-black/50 text-xs font-bold uppercase tracking-wide block mb-3">Metode Pembayaran</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setPaymentMethod("cash")}
                      className={`py-4 px-4 rounded-xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === "cash" ? "border-oreo-black bg-oreo-cream/20 text-oreo-black" : "border-oreo-light text-oreo-black/40 hover:border-oreo-light/60"
                      }`}
                    >
                      <span className="text-2xl">💵</span>
                      <span>Bayar Tunai</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("gateway")}
                      className={`py-4 px-4 rounded-xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === "gateway" ? "border-oreo-black bg-oreo-cream/20 text-oreo-black" : "border-oreo-light text-oreo-black/40 hover:border-oreo-light/60"
                      }`}
                    >
                      <div className="flex gap-1 animate-pulse">
                        <span className="text-xl">💳</span>
                        <span className="text-xl">📱</span>
                      </div>
                      <span>QRIS / E-Wallet</span>
                    </button>
                  </div>
              </div>

              {/* Summary */}
              <div className="oreo-divider my-5" />
              <div className="space-y-1.5 mb-5">
                <div className="flex justify-between text-sm text-oreo-black/50">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-oreo-black">
                  <span>Total Bayar</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mb-3 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</p>}

              <button onClick={handleOrder} disabled={submitting || !canOrder}
                className={`w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${canOrder && !submitting ? "bg-oreo-black text-oreo-white hover:bg-oreo-gray shadow-oreo hover:shadow-oreo-lg" : "bg-oreo-light text-oreo-black/30 cursor-not-allowed"}`}>
                {submitting ? <><div className="w-4 h-4 border-2 border-oreo-white border-t-transparent rounded-full animate-spin" /> Memproses...</> : <>Bayar Sekarang <ChevronRight size={18} /></>}
              </button>
              {!canOrder && (
                <p className="text-oreo-black/30 text-[10px] text-center mt-2 lowercase">
                  Lengkapi data {(!coords) ? "& tandai lokasi di peta" : ""} untuk melanjutkan
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import LeafletMapWidget from "@/components/LeafletMapWidget";
