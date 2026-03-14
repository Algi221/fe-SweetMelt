"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ExternalLink, 
  Search,
  RefreshCw,
  MapPin,
  LogOut,
  ChevronRight,
  Filter,
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  Phone,
  MessageSquare,
  MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  payment_method: string;
  created_at: string;
  notes?: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  paid: { label: "Paid", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-100" },
  processing: { label: "Processing", icon: RefreshCw, color: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-100" },
  shipping: { label: "Shipping", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50/50", border: "border-indigo-100" },
  done: { label: "Completed", icon: Package, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100" },
  failed: { label: "Failed", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_email");
    router.push("/admin/login");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      if (data.data) setOrders(data.data);
    } catch (e) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Status updated: ${newStatus.toUpperCase()}`);
        fetchOrders();
      }
    } catch (e) {
      toast.error("Status update failed");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-slate-400 mb-1">
                <LayoutDashboard size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Control Panel</span>
             </div>
             <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
               Order <span className="text-lumer">Management</span>
             </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all shadow-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
           {[
             { label: "Active Orders", value: orders.filter(o => o.status !== 'done' && o.status !== 'failed').length, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
             { label: "Paid Today", value: orders.filter(o => o.status === 'paid').length, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
             { label: "Completed", value: orders.filter(o => o.status === 'done').length, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
             { label: "Total Revenue", value: formatPrice(orders.filter(o => o.status === 'done' || o.status === 'paid').reduce((a, b) => a + b.total_price, 0)), icon: CreditCard, color: "text-slate-900", bg: "bg-slate-100" }
           ].map((s, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-4">
                   <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>
                      <s.icon size={20} />
                   </div>
                </div>
                <p className="text-2xl font-black text-slate-950 mb-1">{s.value}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
             </div>
           ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
           <div className="p-4 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search name, phone, or order ID..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100/50 transition-all text-slate-900"
                 />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                 <button 
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterStatus === 'all' ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                 >
                   All Status
                 </button>
                 {Object.entries(statusConfig).map(([key, config]) => (
                   <button 
                    key={key}
                    onClick={() => setFilterStatus(key)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${filterStatus === key ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                   >
                     {config.label}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-slate-100">
                   <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">Order Detail</th>
                   <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">Customer</th>
                   <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">Items & Total</th>
                   <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 text-center">Current Status</th>
                   <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                   const status = statusConfig[order.status.toLowerCase()] || statusConfig.pending;
                   return (
                     <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                       <td className="px-6 py-6 min-w-[180px]">
                         <span className="font-mono text-[10px] font-bold text-slate-400">#{order.id.split('-')[0].toUpperCase()}</span>
                         <div className="flex items-center gap-1.5 mt-1 text-slate-600 font-bold text-sm">
                            <Calendar size={14} className="text-slate-300" />
                            {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </div>
                         <p className="text-[10px] text-slate-400 mt-0.5 ml-5 font-medium">Jam {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                       </td>
                       <td className="px-6 py-6 min-w-[250px]">
                         <div className="space-y-2">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                 <User size={14} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
                                <p className="text-xs text-slate-400 font-medium">{order.customer_phone}</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-2 max-w-[220px]">
                              <MapPin size={14} className="text-slate-300 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 italic">{order.customer_address.split('📍')[0]}</p>
                                {order.customer_address.includes('📍') && (
                                  <a 
                                    href={order.customer_address.split('📍')[1]?.replace('Lokasi Map: ', '').trim()}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 text-[10px] font-extrabold text-lumer hover:underline uppercase tracking-tighter"
                                  >
                                    Route <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-6 min-w-[200px]">
                         <div className="space-y-3">
                           <div className="space-y-1 border-l-2 border-slate-100 pl-3">
                             {order.order_items.map((item: any, idx: number) => (
                               <p key={idx} className="text-xs text-slate-600 font-medium">
                                 <span className="font-black text-slate-900">{item.quantity}x</span> {item.product_name}
                               </p>
                             ))}
                             {order.notes && (
                               <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 bg-slate-50 p-1 rounded">
                                  <MessageSquare size={10} />
                                  <span className="italic">{order.notes}</span>
                               </div>
                             )}
                           </div>
                           <div className="pt-2 border-t border-slate-100">
                              <p className="text-lg font-black text-slate-950">{formatPrice(order.total_price)}</p>
                              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-300">{order.payment_method}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-6 text-center">
                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.bg} ${status.color} ${status.border} shadow-sm`}>
                            <status.icon size={12} className="shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                         </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end items-center gap-3">
                             <div className="relative">
                               <select 
                                 onChange={(e) => updateStatus(order.id, e.target.value)}
                                 value={order.status.toLowerCase()}
                                 className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-8 text-[11px] font-bold text-slate-700 outline-none hover:bg-white focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer"
                               >
                                 {Object.entries(statusConfig).map(([key, config]) => (
                                   <option key={key} value={key}>{config.label}</option>
                                 ))}
                               </select>
                               <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={12} />
                             </div>
                             
                             <a 
                               href={`/order/${order.id}`} 
                               target="_blank"
                               className="p-2 bg-slate-900 text-white rounded-xl hover:bg-lumer transition-all shadow-md active:scale-95"
                               title="Receipt Details"
                             >
                               <ExternalLink size={16} />
                             </a>
                          </div>
                       </td>
                     </tr>
                   );
                 }) : (
                   <tr>
                     <td colSpan={5} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                              <Package size={32} />
                           </div>
                           <p className="text-slate-400 text-sm font-bold">No matching orders found.</p>
                        </div>
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="lg:hidden space-y-4">
           {filteredOrders.length > 0 ? filteredOrders.map((order) => {
             const status = statusConfig[order.status.toLowerCase()] || statusConfig.pending;
             return (
               <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-sm relative">
                  {/* Status Bar Top */}
                  <div className={`h-1.5 w-full ${status.bg} border-b ${status.border}`} />
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="font-mono text-xs font-black text-slate-400 tracking-tighter bg-slate-50 px-2 py-0.5 rounded leading-none italic uppercase">#{order.id.split('-')[0]}</span>
                           <span className="text-[10px] font-bold text-slate-300">{new Date(order.created_at).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })}</span>
                        </div>
                        <h3 className="font-black text-slate-900 text-lg mt-1">{order.customer_name}</h3>
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                           <Phone size={12} /> {order.customer_phone}
                        </div>
                      </div>
                      
                      <div className={`flex flex-col items-center gap-1 group`}>
                         <div className={`p-2 rounded-xl border ${status.bg} ${status.color} ${status.border}`}>
                            <status.icon size={18} />
                         </div>
                         <span className={`text-[9px] font-black uppercase tracking-widest ${status.color}`}>{status.label}</span>
                      </div>
                    </div>

                    <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 border-dashed">
                       <div className="space-y-1">
                          {order.order_items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-700">
                               <span>{item.product_name}</span>
                               <span className="bg-slate-200/50 px-2 py-0.5 rounded-md">x{item.quantity}</span>
                            </div>
                          ))}
                       </div>
                       <div className="flex justify-between items-center pt-3 border-t border-slate-200 border-dashed">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grand Total</span>
                          <span className="text-xl font-black text-slate-950">{formatPrice(order.total_price)}</span>
                       </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                       <div className="flex items-start gap-2 bg-indigo-50/30 p-3 rounded-lg border border-indigo-100/50">
                          <MapPin size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                             <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">{order.customer_address.split('📍')[0]}</p>
                             {order.customer_address.includes('📍') && (
                                <a 
                                  href={order.customer_address.split('📍')[1]?.replace('Lokasi Map: ', '').trim()}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-tight mt-1"
                                >
                                  Open in Maps <ExternalLink size={10} />
                                </a>
                             )}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <select 
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              value={order.status.toLowerCase()}
                              className="w-full h-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 appearance-none text-center"
                            >
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                              ))}
                            </select>
                          </div>
                          <a 
                            href={`/order/${order.id}`} 
                            target="_blank"
                            className="bg-slate-900 text-white rounded-xl py-2 px-4 flex items-center justify-center gap-2 font-bold text-xs shadow-md active:scale-95"
                          >
                            <ExternalLink size={14} /> Open Receipt
                          </a>
                       </div>
                    </div>
                  </div>
               </div>
             );
           }) : (
             <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-400 font-bold">No orders found.</p>
             </div>
           )}
        </div>
      </div>

      <footer className="mt-20 py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] border-t border-slate-100">
         SweetMelt Admin Ecosystem • Dynamic Logistics Engine v2.0
      </footer>
    </main>
  );
}
