"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  History, 
  Package, 
  ChevronRight, 
  Clock, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Phone, 
  User,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage as requested
    const savedOrders = localStorage.getItem("sweetmelt_recent_orders");
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setOrders(parsedOrders);
      if (parsedOrders.length > 0) {
        setSelectedOrder(parsedOrders[0]);
      }
    }
    setIsLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <main className="bg-oreo-white min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-12">
          <div>
            <h1 className="font-display text-4xl text-oreo-black mb-2 flex items-center gap-3">
              <History className="text-lumer" /> Pesanan <span className="text-lumer">Saya</span>
            </h1>
            <p className="text-oreo-black/50 text-sm">Cek riwayat kebahagiaan manismu di sini.</p>
          </div>
          <div />

        </div>

        {isLoading ? (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-lumer border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6 bg-oreo-cream/30 rounded-[40px] border-2 border-dashed border-oreo-light">
             <div className="w-20 h-20 bg-oreo-cream rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-oreo-black/20" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-oreo-black mb-2">Belum Ada Pesanan</h3>
                <p className="text-sm text-oreo-black/40 max-w-xs mx-auto">Sepertinya kamu belum mencicipi kelembutan donat lumer kami. Yuk pesan sekarang!</p>
             </div>
             <a href="/#menu" className="btn-primary px-8 py-3 flex items-center gap-2">
                Pesan Sekarang <ArrowRight size={18} />
             </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Orders List */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-oreo-black/40 px-2">Daftar Transaksi</h3>
              <div className="space-y-3 h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                {orders.map((order) => (
                  <motion.button
                    key={order.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-5 rounded-3xl border-2 transition-all duration-300 ${
                      selectedOrder?.id === order.id 
                        ? "bg-oreo-black border-lumer shadow-xl" 
                        : "bg-oreo-white border-oreo-light hover:border-oreo-gray/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedOrder?.id === order.id ? "bg-lumer/20" : "bg-oreo-cream"}`}>
                          <Package size={16} className={selectedOrder?.id === order.id ? "text-lumer" : "text-oreo-black/40"} />
                        </div>
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-tighter ${selectedOrder?.id === order.id ? "text-lumer" : "text-oreo-black/30"}`}>INV-{order.id.split('-')[0].toUpperCase()}</p>
                          <p className={`text-xs font-bold ${selectedOrder?.id === order.id ? "text-oreo-white" : "text-oreo-black"}`}>
                            {order.items.length} Item Donat
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className={selectedOrder?.id === order.id ? "text-lumer" : "text-oreo-black/20"} />
                    </div>
                    <div className="flex justify-between items-end">
                      <p className={`text-[10px] flex items-center gap-1 ${selectedOrder?.id === order.id ? "text-oreo-white/50" : "text-oreo-black/40"}`}>
                        <Calendar size={12} /> {formatDate(order.date)}
                      </p>
                      <p className={`font-bold ${selectedOrder?.id === order.id ? "text-lumer" : "text-oreo-black"}`}>
                        Rp {order.total.toLocaleString()}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right: Order Details / Nota */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {selectedOrder && (
                  <motion.div
                    key={selectedOrder.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-oreo-white border-2 border-oreo-black rounded-[40px] shadow-oreo overflow-hidden sticky top-28"
                  >
                    {/* Invoice Header */}
                    <div className="bg-oreo-black p-8 text-oreo-white relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-lumer/20 rounded-full blur-2xl -mr-16 -mt-16" />
                       <div className="flex justify-between items-center relative z-10">
                          <div>
                            <h4 className="font-display text-2xl mb-1">Nota Pesanan</h4>
                            <p className="text-lumer text-xs font-bold tracking-widest uppercase">INV-{selectedOrder.id.toUpperCase()}</p>
                          </div>
                          <div className="text-right">
                             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center ml-auto mb-2">
                                <div className="w-8 h-8 rounded-full border-2 border-oreo-black flex items-center justify-center">
                                  <div className="w-3 h-3 bg-oreo-black rounded-full" />
                                </div>
                             </div>
                             <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">SweetMelt Premium</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-8 space-y-8">
                       {/* Customer Info */}
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-oreo-cream flex items-center justify-center">
                                  <User size={14} className="text-oreo-black/40" />
                               </div>
                               <div>
                                  <p className="text-[9px] uppercase font-bold text-oreo-black/30">Pelanggan</p>
                                  <p className="text-xs font-bold text-oreo-black">{selectedOrder.customer.name}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-oreo-cream flex items-center justify-center">
                                  <Phone size={14} className="text-oreo-black/40" />
                               </div>
                               <div>
                                  <p className="text-[9px] uppercase font-bold text-oreo-black/30">Telepon</p>
                                  <p className="text-xs font-bold text-oreo-black">{selectedOrder.customer.phone}</p>
                               </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-full bg-oreo-cream flex items-center justify-center shrink-0">
                                <MapPin size={14} className="text-oreo-black/40" />
                             </div>
                             <div>
                                <p className="text-[9px] uppercase font-bold text-oreo-black/30">Alamat Kirim</p>
                                <p className="text-xs font-bold text-oreo-black leading-relaxed">{selectedOrder.customer.address}</p>
                             </div>
                          </div>
                       </div>

                       <div className="oreo-divider" />

                       {/* Items List */}
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-oreo-black/40">Rincian Menu</h4>
                          <div className="space-y-3">
                             {selectedOrder.items.map((item, idx) => (
                               <div key={idx} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-xl bg-oreo-cream flex items-center justify-center text-[10px] font-bold">
                                        {item.quantity}x
                                     </div>
                                     <div>
                                        <p className="text-xs font-bold text-oreo-black">{item.name}</p>
                                        <p className="text-[10px] text-oreo-black/40">{item.variant || 'Original'}</p>
                                     </div>
                                  </div>
                                  <p className="text-xs font-bold text-oreo-black">Rp {(item.price * item.quantity).toLocaleString()}</p>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-oreo-cream/50 rounded-3xl p-6 border border-oreo-light space-y-3">
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-oreo-black/40 font-medium">Subtotal</span>
                             <span className="text-oreo-black font-bold">Rp {selectedOrder.total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-oreo-black/40 font-medium">Ongkos Kirim</span>
                             <span className="text-green-600 font-bold">Gratis</span>
                          </div>
                          <div className="h-px bg-oreo-gray/20 my-2" />
                          <div className="flex justify-between items-center">
                             <span className="text-oreo-black font-display text-lg">Total</span>
                             <span className="text-lumer font-display text-2xl">Rp {selectedOrder.total.toLocaleString()}</span>
                          </div>
                       </div>

                       <div className="flex items-center justify-center gap-4 py-4 text-oreo-black/20">
                          <Clock size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Terima kasih atas pesananmu!</span>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
