"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CheckCircle, Clock, XCircle, ArrowLeft, Download, ExternalLink } from "lucide-react";

import { supabase } from "@/lib/supabase";

interface OrderItem {
  product_name: string;
  quantity: number;
  price_at_order: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  status: string;
  payment_method?: string;
  payment_url?: string;
  created_at: string;
  order_items: OrderItem[];
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

export default function OrderStatusPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(product_name, quantity, price_at_order)")
        .eq("id", id)
        .single();
        
      if (data) setOrder(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!id) return;
    fetchOrder();
    const t = setInterval(fetchOrder, 5000); // auto-poll every 5s
    return () => clearInterval(t);
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-oreo-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-12 h-12 border-4 border-oreo-black border-t-transparent rounded-full animate-spin" />
          <p className="text-oreo-black/50 font-medium">Mencari Nota Pesanan...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-oreo-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-display text-2xl text-oreo-black mb-2">Order Tidak Ditemukan</h2>
          <Link href="/menu" className="text-lumer hover:underline">Kembali ke Menu</Link>
        </div>
      </main>
    );
  }

  const isPaid = order.status.toLowerCase() === "paid" || order.status.toLowerCase() === "success";
  const isPending = order.status.toLowerCase() === "pending" || order.status.toLowerCase() === "unpaid";
  const isFailed = order.status.toLowerCase() === "failed" || order.status.toLowerCase() === "error";
  const shortId = order.id.split("-")[0].toUpperCase();

  // Dynamic Styles
  const statusColor = isPaid ? "bg-green-500" : isPending ? "bg-orange-500" : "bg-red-500";
  const statusLightColor = isPaid ? "bg-green-50" : isPending ? "bg-orange-50" : "bg-red-50";
  const statusBorderColor = isPaid ? "border-green-200" : isPending ? "border-orange-200" : "border-red-200";
  const statusTextColor = isPaid ? "text-green-700" : isPending ? "text-orange-700" : "text-red-700";

  return (
    <main className="min-h-screen bg-oreo-white pb-16 print:bg-white print:pb-0 print:min-h-0">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className={`${isPaid ? 'bg-green-600' : isPending ? 'bg-orange-500' : 'bg-red-600'} pt-28 pb-32 px-6 text-center transition-colors duration-500 print:hidden`}>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
          {isPaid ? "Terima Kasih!" : isPending ? "Satu Langkah Lagi" : "Ada Kendala"}
        </h1>
        <p className="text-white/80 text-sm max-w-xs mx-auto">
          {isPaid ? "Pembayaran kamu sudah kami terima dan pesanan akan segera diproses." : isPending ? "Mohon selesaikan pembayaran agar pesanan bisa kami siapkan." : "Mohon maaf, pembayaran kamu tidak dapat kami verifikasi."}
        </p>
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-20 relative z-10 print:mt-0 print:px-6 print:w-full print:max-w-none">
        {/* Receipt Ticket / Nota */}
        <div className="bg-oreo-white rounded-t-3xl border border-oreo-light shadow-oreo-lg p-6 md:p-8 relative overflow-hidden print:shadow-none print:border-oreo-black/20 print:rounded-2xl print:border-2">
          
          {/* Header Status */}
          <div className="flex flex-col items-center justify-center text-center border-b-2 border-dashed border-oreo-light pb-6 mb-6">
            <div className={`w-20 h-20 rounded-full ${statusLightColor} flex items-center justify-center mb-4`}>
              {isPaid ? (
                <CheckCircle size={40} className="text-green-500" />
              ) : isPending ? (
                <Clock size={40} className="text-orange-500 animate-pulse" />
              ) : (
                <XCircle size={40} className="text-red-500" />
              )}
            </div>
            
            <div className={`px-4 py-1 rounded-full ${statusLightColor} ${statusBorderColor} border ${statusTextColor} text-[10px] font-bold uppercase tracking-widest mb-3`}>
              Status: {isPaid ? "Berhasil Bayar" : isPending ? "Menunggu Pembayaran" : "Dibatalkan / Gagal"}
            </div>

            <h2 className="font-display text-2xl font-bold text-oreo-black mb-1">
              {formatPrice(order.total_price)}
            </h2>
            <p className="text-oreo-black/50 text-xs mt-1">
              No. Invoice: <span className="font-mono font-medium text-oreo-black">#INV-{shortId}</span>
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4 text-sm text-oreo-black/70 mb-6">
            <div className="flex justify-between">
              <span>Nama</span>
              <span className="font-medium text-oreo-black">{order.customer_name}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Waktu Pengantaran (PO)</span>
              <span className="font-bold text-oreo-black">Selasa, 17 Maret 2026</span>
            </div>

            <div className="flex flex-col gap-1 border-t border-oreo-light pt-3">
              <span className="text-xs font-bold text-oreo-black/40 uppercase tracking-widest">Alamat Pengiriman</span>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 italic text-xs leading-relaxed text-oreo-black">
                {order.customer_address.split('📍')[0]}
                {order.customer_address.includes('📍') && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-lumer uppercase">📍 Titik Lokasi Tersemat</span>
                  </div>
                )}
              </div>
            </div>

            {order.payment_method && (
              <div className="flex justify-between">
                <span>Metode Pembayaran</span>
                <span className="font-medium text-oreo-black uppercase">{order.payment_method}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Waktu Pemesanan</span>
              <span className="font-medium text-oreo-black">
                {new Date(order.created_at).toLocaleString("id-ID", {
                  dateStyle: "medium", timeStyle: "short"
                })}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border-y border-dashed border-slate-200 py-4 mb-6">
            <h3 className="font-bold text-oreo-black mb-3 text-[10px] uppercase tracking-widest px-2">Rincian Pesanan</h3>
            <div className="space-y-3 px-2">
              {order.order_items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm items-start gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-oreo-black truncate leading-tight">{item.product_name}</p>
                    <p className="text-[10px] text-oreo-black/40">{item.quantity} x {formatPrice(item.price_at_order)}</p>
                  </div>
                  <span className="text-oreo-black font-semibold text-xs whitespace-nowrap">{formatPrice(item.price_at_order * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 px-2 flex justify-between items-center">
               <span className="text-xs font-bold text-oreo-black">TOTAL</span>
               <span className="text-lg font-black text-oreo-black">{formatPrice(order.total_price)}</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-oreo-black/30 italic">Terima kasih sudah jajan di SweetMelt! 🍪</p>
            <p className="text-[8px] text-oreo-black/20 mt-1 uppercase tracking-tighter">Generated by SweetMelt System</p>
          </div>
        </div>

        {/* Decorative receipt bottom edge */}
        <div className="relative h-6 w-full overflow-hidden print:hidden">
          <div className="absolute top-0 left-0 w-full flex">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-[5%] aspect-square bg-oreo-white border-b border-r border-oreo-light transform -rotate-45 -translate-y-1/2" />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 print:hidden">
          <div className="flex flex-col gap-3">
            {isPaid && (
              <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={() => window.print()}>
                <Download size={18} /> Simpan / Cetak Nota
              </button>
            )}
            
            <a 
              href={`https://wa.me/6289699893242?text=${encodeURIComponent(
                `Halo Admin SweetMelt! 🍪\n\n` +
                `Saya ingin konfirmasi pesanan *#${shortId}*\n` +
                `Atas Nama: *${order.customer_name}*\n\n` +
                `*Pesanan:* \n${order.order_items.map(i => `- ${i.quantity}x ${i.product_name}`).join("\n")}\n\n` +
                `*Total:* ${formatPrice(order.total_price)}\n` +
                `*Metode:* ${order.payment_method?.toUpperCase()}\n` +
                `*Alamat:* ${order.customer_address.split('📍')[0].trim()}\n` +
                (order.customer_address.includes('📍') 
                  ? `*Link Lokasi:* ${order.customer_address.split('📍')[1].replace('Lokasi Map: ', '').trim()}\n` 
                  : '') +
                `\nMohon segera diproses ya, terima kasih!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-[#25D366] text-white font-bold text-center hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 shadow-lg scale-100 hover:scale-[1.02] active:scale-95"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5 invert brightness-0" />
              Konfirmasi via WhatsApp
            </a>
          {isPending && (order.payment_method === "gateway" || order.payment_method === "midtrans") && (
            <div className="flex flex-col gap-3 p-4 bg-oreo-cream/30 rounded-2xl border-2 border-dashed border-oreo-black/20 text-center animate-slide-up">
              <p className="text-sm font-bold text-oreo-black mb-1 flex items-center justify-center gap-2">
                <span className="text-xl">💳</span> Siap Selesaikan Pembayaran?
              </p>
              
              <button 
                onClick={async () => {
                  if (order.payment_url) {
                    window.location.href = order.payment_url;
                    return;
                  }
                  try {
                    const { data, error } = await supabase.functions.invoke("create-payment", {
                      body: { 
                        order_id: order.id,
                        frontend_url: window.location.origin 
                      }
                    });
                    if (data?.paymentUrl) window.location.href = data.paymentUrl;
                    else alert("Gagal memproses pembayaran: " + (error?.message || "Silakan hubungi admin."));
                  } catch (e) { alert("Terjadi kesalahan."); }
                }}
                className="w-full py-4 rounded-xl bg-oreo-black text-oreo-white font-bold text-lg hover:bg-oreo-gray transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Bayar Sekarang <ExternalLink size={20} />
              </button>

              <p className="text-[10px] text-oreo-black/40 mt-1">
                Aman & Terverifikasi oleh <span className="font-bold">Midtrans</span>.
              </p>

              {/* Simulation Button for Testing */}
              <button 
                onClick={async () => {
                  if (confirm("Simulasi pembayaran berhasil? (Hanya untuk testing)")) {
                    try {
                      const { error } = await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);
                      if (!error) window.location.reload();
                      else alert("Gagal simulasi.");
                    } catch (e) { alert("Terjadi kesalahan."); }
                  }
                }}
                className="mt-4 text-[10px] text-lumer/40 hover:text-lumer transition-colors underline"
              >
                Simulasi Bayar Berhasil (Khusus Testing)
              </button>
            </div>
          )}
       </div>

          {isPending && order.payment_method === "gateway" && (
             <p className="text-center text-sm text-oreo-black/50 my-2">
               Halaman ini akan otomatis refresh jika Anda sudah bayar.
             </p>
          )}

          <Link href="/menu" className="w-full py-3.5 rounded-xl border-2 border-oreo-black text-oreo-black font-bold text-center hover:bg-oreo-black hover:text-oreo-white transition-all flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Mau Tambah Pesanan Lagi?
          </Link>
        </div>

      </div>
    </main>
  );
}
