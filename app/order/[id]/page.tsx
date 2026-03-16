"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CheckCircle, Clock, XCircle, ArrowLeft, Download, ExternalLink } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
  duitku_reference?: string;
  duitku_payment_url?: string;
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
      const res = await fetch(`${API_URL}/api/orders/${id}`);
      const data = await res.json();
      if (data.data) setOrder(data.data);
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
  const isPending = order.status.toLowerCase() === "pending";
  const shortId = order.id.split("-")[0].toUpperCase();

  return (
    <main className="min-h-screen bg-oreo-white pb-16">
      <Navbar />

      <div className="bg-oreo-black pt-28 pb-32 px-6 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-oreo-white">
          Status <span className="text-oreo-cream italic">Pesanan</span>
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-20 relative z-10">
        {/* Receipt Ticket / Nota */}
        <div className="bg-oreo-white rounded-t-3xl border border-oreo-light shadow-oreo-lg p-6 md:p-8 relative overflow-hidden">
          
          {/* Header Status */}
          <div className="flex flex-col items-center justify-center text-center border-b-2 border-dashed border-oreo-light pb-6 mb-6">
            {isPaid ? (
              <CheckCircle size={56} className="text-green-500 mb-3" />
            ) : isPending ? (
              <Clock size={56} className="text-yellow-500 mb-3 animate-pulse" />
            ) : (
              <XCircle size={56} className="text-red-500 mb-3" />
            )}
            
            <h2 className="font-display text-2xl font-bold text-oreo-black mb-1">
              {isPaid ? "Pembayaran Berhasil!" : isPending ? "Menunggu Pembayaran" : "Pembayaran Gagal"}
            </h2>
            <p className="text-oreo-black/50 text-sm">
              ID Pesanan: <span className="font-mono font-medium text-oreo-black">#{shortId}</span>
            </p>
          </div>

          <p className="text-oreo-black text-center font-bold text-3xl mb-6">{formatPrice(order.total_price)}</p>

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

          <div className="bg-oreo-cream/30 p-4 rounded-xl mb-2">
            <h3 className="font-bold text-oreo-black mb-3 text-sm">Rincian Item:</h3>
            <div className="space-y-2">
              {order.order_items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-oreo-black/70">
                    <span className="font-medium text-oreo-black">{item.quantity}x</span> {item.product_name}
                  </span>
                  <span className="text-oreo-black font-medium">{formatPrice(item.price_at_order * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Squiggly bottom receipt border effect */}
        <div className="h-4 bg-oreo-white border-x border-b border-oreo-light rounded-b-lg flex" style={{
          backgroundImage: "radial-gradient(circle at 10px 10px, transparent 10px, #ffffff 11px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 -10px"
        }} />

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
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
          {isPending && order.payment_method === "gateway" && (
            <div className="flex flex-col gap-3 p-4 bg-oreo-cream/30 rounded-2xl border-2 border-dashed border-oreo-black/20 text-center animate-slide-up">
              <p className="text-sm font-bold text-oreo-black mb-1 flex items-center justify-center gap-2">
                <span className="text-xl">💳</span> Siap Selesaikan Pembayaran?
              </p>
              
              <button 
                onClick={async () => {
                  if (order.duitku_payment_url) {
                    window.location.href = order.duitku_payment_url;
                    return;
                  }
                  try {
                    const res = await fetch(`${API_URL}/api/payment/create`, {
                      method: "POST", headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ order_id: order.id }),
                    });
                    const data = await res.json();
                    if (data.paymentUrl) window.location.href = data.paymentUrl;
                    else alert("Gagal memproses pembayaran. Silakan hubungi admin.");
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
                      const res = await fetch(`${API_URL}/api/payment/simulate-success`, {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order_id: order.id }),
                      });
                      if (res.ok) window.location.reload();
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

          {isPending && order.duitku_reference && (
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
