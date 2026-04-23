"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ExternalLink, 
  Search,
  RefreshCw,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  MessageSquare,
  BarChart3,
  ShoppingBag,
  Bell,
  Settings,
  MoreHorizontal,
  Plus,
  Layers,
  History,
  Star,
  Users,
  Eye,
  Trash2,
  Edit3,
  Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase";

// Types
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

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: "In progress", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-400" },
  paid: { label: "Paid", color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-400" },
  processing: { label: "Processing", color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-400" },
  shipping: { label: "Shipping", color: "text-indigo-600", bg: "bg-indigo-50", dot: "bg-indigo-400" },
  done: { label: "Completed", color: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" },
  failed: { label: "Failed", color: "text-rose-600", bg: "bg-rose-50", dot: "bg-rose-400" },
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab ] = useState("Dashboard");
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
      return;
    }
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [oRes, pRes, cRes, mRes] = await Promise.all([
        supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('name'),
        supabase.from('categories').select('*').order('name'),
        supabase.from('comments').select('*').order('created_at', { ascending: false })
      ]);
      
      if (oRes.data) setOrders(oRes.data as any[]);
      if (pRes.data) setProducts(pRes.data);
      if (cRes.data) setCategories(cRes.data);
      if (mRes.data) setComments(mRes.data);
    } catch (e) {
      toast.error("Failed to sync with system");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (!error) {
        toast.success(`Order ${newStatus}`);
        fetchAllData();
      }
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  // Derived filtered data
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (activeTab === "Orders") return orders.filter(o => o.customer_name.toLowerCase().includes(term) || o.id.toLowerCase().includes(term));
    if (activeTab === "Products") return products.filter(o => o.name.toLowerCase().includes(term));
    if (activeTab === "Categories") return categories.filter(o => o.name.toLowerCase().includes(term));
    if (activeTab === "Comments") return comments.filter(o => o.content?.toLowerCase().includes(term));
    return [];
  }, [activeTab, searchTerm, orders, products, categories, comments]);

  return (
    <div className="min-h-screen bg-[#F1F3F6] flex font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white m-6 mr-0 rounded-[32px] shadow-sm flex flex-col overflow-hidden border border-white/50 shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
              <Package className="text-white" size={20} />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 leading-none">
              Sweet<span className="text-lumer">Melt</span>
            </span>
          </div>

          <nav className="space-y-1">
            {[
              { name: "Dashboard", icon: LayoutDashboard },
              { name: "Orders", icon: ShoppingBag, badge: orders.filter(o => o.status === 'pending').length },
              { name: "Products", icon: Package, badge: products.length },
              { name: "Categories", icon: Layers },
              { name: "Comments", icon: MessageSquare, badge: comments.length },
            ].map((item) => (
              <button 
                key={item.name}
                onClick={() => { setActiveTab(item.name); setSearchTerm(""); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === item.name ? 'bg-slate-950 text-white shadow-xl translate-x-1' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={activeTab === item.name ? 'text-white' : 'group-hover:text-slate-900'} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </div>
                {item.badge ? (
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black tracking-tighter ${activeTab === item.name ? 'bg-white/20 text-white' : 'bg-lumer/20 text-lumer'}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-50">
          <div className="bg-slate-50 p-4 rounded-3xl flex items-center gap-3 border border-slate-100/50">
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black underline decoration-lumer/40 decoration-2 truncate italic">System Admin</p>
            </div>
            <button onClick={handleLogout} className="text-slate-300 hover:text-rose-500 transition-colors p-2 rounded-xl hover:bg-white">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 flex flex-col h-screen">
        
        {/* Top Header */}
        <header className="flex items-center justify-between mb-8 gap-4 px-2 shrink-0">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab.toLowerCase()}...`} 
                className="w-full bg-white/80 backdrop-blur-sm border-white border text-sm py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden lg:flex items-center text-slate-400 text-[10px] font-black tracking-[0.2em] gap-2 bg-white/80 px-5 py-3.5 rounded-2xl border border-white shadow-sm">
                <Calendar size={14} className="text-lumer" />
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
             </div>
             <button onClick={fetchAllData} className="h-12 px-6 bg-slate-950 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs shadow-xl hover:bg-slate-800 transition-all active:scale-95 tracking-widest uppercase">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                {loading ? "Syncing" : "Sync System"}
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-12"
              >
                <div className="xl:col-span-2 space-y-6">
                  {/* Productivity Graph */}
                  <section className="bg-white rounded-[44px] p-10 shadow-sm border border-white/50 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                      <div>
                        <h3 className="text-2xl font-black tracking-tighter">Productivity Trend</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Growth Index • Weekly Analysis</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-lumer/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-lumer">Live System</span>
                      </div>
                    </div>
                    
                    <div className="h-64 w-full relative pt-4 z-10">
                      <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FFB800" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#FFB800" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,85 Q50,45 100,70 T200,40 T300,80 T400,30 L400,100 L0,100 Z" fill="url(#chartGradient)" className="opacity-50" />
                        <path d="M0,85 Q50,45 100,70 T200,40 T300,80 T400,30" fill="none" stroke="#FFB800" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        <motion.circle 
                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                          cx="200" cy="40" r="7" fill="#FFB800" stroke="white" strokeWidth="4" className="shadow-xl" 
                        />
                      </svg>
                      <div className="flex justify-between mt-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] px-4">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                    </div>
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-50" />
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inventory Snapshot */}
                    <section className="bg-slate-950 text-white rounded-[44px] p-10 shadow-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-10">
                           <h3 className="text-xl font-black tracking-tight">Stock Vitality</h3>
                           <Package size={20} className="text-lumer" />
                        </div>
                        <div className="space-y-6">
                          {products.slice(0, 3).map((p, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.1em]">
                                <span className="text-white/60">{p.name}</span>
                                <span className={p.stock < 10 ? "text-rose-400" : "text-lumer"}>{p.stock || 0} unit</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((p.stock || 0) * 1.5, 100)}%` }}
                                  className={`h-full rounded-full ${p.stock < 10 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-lumer shadow-[0_0_10px_rgba(255,184,0,0.3)]'}`} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-lumer/10 rounded-full blur-[100px] opacity-40 shrink-0" />
                    </section>

                    {/* Recent Feedback */}
                    <section className="bg-white rounded-[44px] p-10 shadow-sm border border-white/50 relative overflow-hidden">
                       <h3 className="text-xl font-black tracking-tight mb-8">Customer Voice</h3>
                       <div className="space-y-6 relative z-10">
                          {comments.slice(0, 3).map((c, i) => (
                            <div key={i} className="flex gap-4 group">
                               <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-lumer group-hover:text-white transition-all duration-500">
                                  <Star size={18} className="group-hover:fill-current" />
                               </div>
                               <div className="min-w-0">
                                  <p className="text-xs font-bold leading-tight line-clamp-2 text-slate-500 italic">"{c.content}"</p>
                                  <p className="text-[10px] text-slate-300 font-black mt-2 uppercase tracking-tighter">Verified Order: {new Date(c.created_at).toLocaleDateString()}</p>
                               </div>
                            </div>
                          ))}
                          {comments.length === 0 && <p className="text-center py-8 text-xs text-slate-300 font-black uppercase tracking-widest italic">Silent System</p>}
                       </div>
                    </section>
                  </div>
                </div>

                {/* Dashboard Summary Column */}
                <div className="space-y-6">
                  <section className="bg-white rounded-[44px] p-10 shadow-sm border border-white/50 h-full relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                       <h2 className="text-2xl font-black tracking-tighter">System Pulse</h2>
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner"><History size={20} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                       <div className="bg-slate-50 p-8 rounded-[40px] text-center border border-white shadow-inner group hover:bg-emerald-50 transition-colors duration-500">
                          <p className="text-5xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform">{orders.filter(o => o.status === 'done' || o.status === 'paid').length}</p>
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full inline-block border border-emerald-100">Settled</p>
                       </div>
                       <div className="bg-slate-50 p-8 rounded-[40px] text-center border border-white shadow-inner group hover:bg-amber-50 transition-colors duration-500">
                          <p className="text-5xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform">{orders.filter(o => o.status === 'pending' || o.status === 'processing').length}</p>
                          <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full inline-block border border-amber-100">In Transit</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: "Total Revenue", val: formatPrice(orders.reduce((a, b) => a + (b.total_price || 0), 0)), icon: ShoppingBag, color: "bg-indigo-50 text-indigo-600" },
                        { label: "Client Base", val: `${new Set(orders.map(o => o.customer_phone)).size} Users`, icon: Users, color: "bg-emerald-50 text-emerald-600" }
                      ].map((stat, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-white hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                           <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-md group-hover:bg-slate-950 group-hover:text-white transition-all`}>
                                 <stat.icon size={22} />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                 <p className="text-lg font-black text-slate-950 tracking-tight">{stat.val}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setActiveTab("Orders")}
                      className="w-full mt-14 py-6 bg-slate-950 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:bg-lumer hover:shadow-lumer/40 transition-all active:scale-[0.98]"
                    >
                      Process Orders
                    </button>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-slate-50 rounded-full blur-[80px]" />
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === "Orders" && (
              <motion.section 
                key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[44px] p-10 shadow-sm border border-white/50 mb-12"
              >
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-black tracking-tighter">Order Logistics</h2>
                  <Filter className="text-slate-200" size={20} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px]">
                      <thead className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] text-left border-b border-slate-50">
                        <tr>
                          <th className="pb-8 pl-4">Identification</th>
                          <th className="pb-8">Line Items</th>
                          <th className="pb-8">Financials</th>
                          <th className="pb-8">Logistics Status</th>
                          <th className="pb-8 text-right pr-4">Matrix</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50/50">
                        {filteredData.map((order: any) => {
                          const status = statusConfig[order.status.toLowerCase()] || statusConfig.pending;
                          return (
                            <tr key={order.id} className="group hover:bg-slate-50 transition-all duration-300">
                              <td className="py-8 pl-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">{order.customer_name.charAt(0)}</div>
                                  <div>
                                    <p className="font-black text-sm text-slate-900 leading-none mb-1.5">{order.customer_name}</p>
                                    <p className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">{order.id.split('-')[0]}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-8">
                                <p className="text-xs font-bold text-slate-500 italic max-w-[200px] truncate">{order.order_items?.map((i: any) => `${i.quantity}x ${i.product_name}`).join(', ') || "No Items"}</p>
                              </td>
                              <td className="py-8">
                                 <p className="text-sm font-black text-slate-950">{formatPrice(order.total_price)}</p>
                                 <p className="text-[9px] font-black text-indigo-400 tracking-widest mt-1 opacity-60 uppercase">{order.payment_method}</p>
                              </td>
                              <td className="py-8">
                                 <div className="relative inline-block">
                                   <select 
                                     value={order.status.toLowerCase()}
                                     onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                     className={`text-[9px] font-black uppercase tracking-widest py-3 px-5 rounded-2xl outline-none cursor-pointer border-none shadow-sm transition-all pr-10 ${status.bg} ${status.color} hover:shadow-lg`}
                                   >
                                     {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k} className="bg-white text-slate-900">{v.label.toUpperCase()}</option>)}
                                   </select>
                                   <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 opacity-40 pointer-events-none" size={12} />
                                 </div>
                              </td>
                              <td className="py-8 text-right pr-4">
                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <a href={`/order/${order.id}`} target="_blank" className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-lg text-slate-300 hover:text-slate-950 transition-all active:scale-95 border border-slate-50"><ExternalLink size={16} /></a>
                                 </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                </div>
              </motion.section>
            )}

            {activeTab === "Products" && (
              <motion.section 
                key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[44px] p-10 shadow-sm border border-white/50 mb-12"
              >
                <div className="flex items-center justify-between mb-12">
                   <h2 className="text-3xl font-black tracking-tighter">Inventory Control</h2>
                   <button className="px-6 py-3.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-lumer transition-all flex items-center gap-2 active:scale-95"><Plus size={16} /> Add Product</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((p: any) => (
                    <div key={p.id} className="bg-slate-50 rounded-[38px] p-8 border border-white shadow-inner group hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                       <div className="flex gap-4 mb-8">
                          <div className="w-20 h-20 bg-white rounded-[28px] shadow-md flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform">
                             <img src={p.image_url || "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=200"} className="w-full h-full object-cover" alt={p.name} />
                          </div>
                          <div className="min-w-0 pt-2">
                             <h4 className="text-lg font-black tracking-tight truncate leading-none mb-1">{p.name}</h4>
                             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest truncate">{p.category?.name || "Sweet Art"}</p>
                             <p className="text-sm font-black text-lumer mt-3">{formatPrice(p.price)}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between pt-6 border-t border-slate-100/50">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{p.stock || 0} In Stock</span>
                          </div>
                          <div className="flex gap-2">
                             <button className="p-2 text-slate-300 hover:text-slate-950 transition-colors"><Edit3 size={16} /></button>
                             <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === "Categories" && (
              <motion.section 
                key="categories" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[44px] p-10 shadow-sm border border-white/50 mb-12"
              >
                 <div className="flex items-center justify-between mb-12">
                   <h2 className="text-3xl font-black tracking-tighter">System Taxonomy</h2>
                   <button className="px-6 py-3.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-lumer transition-all flex items-center gap-2"><Plus size={16} /> Create Segment</button>
                </div>
                <div className="space-y-4">
                  {filteredData.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between bg-slate-50 p-8 rounded-[32px] border border-white hover:bg-white hover:shadow-2xl transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-md transform -rotate-6 group-hover:rotate-0 transition-all duration-500 group-hover:text-lumer">
                             <Layers size={24} />
                          </div>
                          <div>
                             <h4 className="font-black text-lg tracking-tight uppercase">{c.name}</h4>
                             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Active System Segment</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button className="h-12 px-6 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 hover:shadow-md transition-all">Modify</button>
                          <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:shadow-md transition-all"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === "Comments" && (
              <motion.section 
                key="comments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[44px] p-10 shadow-sm border border-white/50 mb-12"
              >
                 <div className="flex items-center justify-between mb-12">
                   <h2 className="text-3xl font-black tracking-tighter">Communication Logs</h2>
                   <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">{comments.length} Total</div>
                </div>
                <div className="space-y-6">
                   {filteredData.map((c: any) => (
                      <div key={c.id} className="p-10 bg-slate-50 rounded-[40px] border border-white hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                         <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-all duration-500">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`} alt="User" />
                               </div>
                               <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    {[1,2,3,4,5].map(v => <Star key={v} size={10} className={v <= (c.rating || 5) ? "text-lumer fill-current" : "text-slate-200"} />)}
                                  </div>
                                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">{new Date(c.created_at).toLocaleString()}</p>
                               </div>
                            </div>
                            <button className="text-slate-300 hover:text-rose-500 transition-colors p-2 rounded-xl hover:bg-slate-50"><Trash2 size={18} /></button>
                         </div>
                         <p className="text-sm font-bold text-slate-700 leading-relaxed indent-4">"{c.content}"</p>
                      </div>
                   ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        select { appearance: none; }
      `}</style>
    </div>
  );
}
