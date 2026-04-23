"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Layers,
  MessageSquare,
  LogOut,
  Calendar,
  MoreHorizontal,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Edit,
  Trash2,
  PieChart
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase";

// --- Types ---
interface Order {
  id: string;
  customer_name: string;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  order_items: any[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50" },
  paid: { label: "Paid", color: "text-emerald-600", bg: "bg-emerald-50" },
  processing: { label: "Processing", color: "text-blue-600", bg: "bg-blue-50" },
  shipping: { label: "En Route", color: "text-indigo-600", bg: "bg-indigo-50" },
  done: { label: "Completed", color: "text-slate-600", bg: "bg-slate-100" },
  failed: { label: "Failed", color: "text-rose-600", bg: "bg-rose-50" },
};

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
    <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={24} className="text-white" />
    </div>
    <div className="flex flex-col">
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
    </div>
    <div className="mt-4 flex items-center gap-1.5">
      <div className={`flex items-center gap-0.5 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trendValue}
      </div>
      <span className="text-[10px] font-medium text-slate-400">vs last month</span>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      toast.error("Failed to sync system data");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (!error) {
        toast.success(`Order status updated to ${newStatus}`);
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

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (activeTab === "Dashboard" || activeTab === "Orders") return orders.filter(o => o.customer_name.toLowerCase().includes(term) || o.id.toLowerCase().includes(term));
    if (activeTab === "Products") return products.filter(o => o.name.toLowerCase().includes(term));
    if (activeTab === "Categories") return categories.filter(o => o.name.toLowerCase().includes(term));
    if (activeTab === "Comments") return comments.filter(o => o.content?.toLowerCase().includes(term));
    return [];
  }, [activeTab, searchTerm, orders, products, categories, comments]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans text-slate-900">
      
      {/* SIDEBAR - TailAdmin Style Fixed Left */}
      <aside className="w-72 bg-slate-900 h-screen fixed left-0 top-0 text-slate-400 flex flex-col z-[100] transition-all">
        <div className="p-8 pb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-lumer rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,184,0,0.3)]">
            <Package className="text-slate-900" size={20} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            TailAdmin<span className="text-lumer">.</span>
          </span>
        </div>

        <div className="flex-1 px-4 overflow-y-auto custom-scrollbar italic-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 px-4">Menu Overview</p>
          <nav className="space-y-1.5">
            {[
              { name: "Dashboard", icon: LayoutDashboard },
              { name: "Orders", icon: ShoppingBag, badge: orders.filter(o => o.status === 'pending').length },
              { name: "Products", icon: Package },
              { name: "Categories", icon: Layers },
              { name: "Comments", icon: MessageSquare },
            ].map((item) => (
              <button 
                key={item.name}
                onClick={() => { setActiveTab(item.name); setSearchTerm(""); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === item.name ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon size={20} className={activeTab === item.name ? 'text-lumer' : 'group-hover:text-lumer'} />
                  <span className="text-[14px] font-semibold">{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="bg-lumer text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-12 mb-6 px-4">Preference</p>
          <nav className="space-y-1.5">
            <button className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-[14px] font-semibold">
              <Settings size={20} className="hover:text-lumer" />
              Settings
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl hover:bg-slate-800 text-rose-400 transition-all text-[14px] font-semibold mt-4">
              <LogOut size={20} />
              Sign Out
            </button>
          </nav>
        </div>

        <div className="p-8 mt-auto italic">
           <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lumer flex items-center justify-center font-black text-slate-900 border-2 border-slate-900 shadow-sm">AM</div>
              <div className="min-w-0">
                 <p className="text-xs font-black text-white truncate leading-none mb-1">Adam Melt</p>
                 <p className="text-[10px] text-slate-500 font-bold tracking-tight">System Architect</p>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA - TailAdmin Layout Offset by Sidebar */}
      <main className="flex-1 ml-72 flex flex-col h-screen">
        
        {/* HEADER BAR */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
          <div className="flex-1 max-w-lg">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lumer transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Type to search system records..."
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-lumer/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          <div className="flex items-center gap-6 pl-10 border-l border-slate-50">
             <button className="relative w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-lumer/10 transition-all group">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
             </button>
             <button onClick={fetchAllData} className="flex items-center gap-3 px-6 h-11 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                {loading ? "Updating" : "Sync Data"}
             </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{activeTab}</h1>
              <p className="text-slate-400 text-sm font-semibold italic mt-1">Operational view of your SweetMelt ecosystem.</p>
            </div>
            {activeTab !== "Dashboard" && activeTab !== "Orders" && (
               <button className="h-12 px-8 bg-lumer text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-lumer/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                 <Plus size={18} strokeWidth={3} /> Add {activeTab === "Products" ? "Product" : activeTab === "Categories" ? "Segment" : "Entry"}
               </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10 pb-10">
                
                {/* 4 CARDS TOP GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <StatCard title="Total Views" value="3.456K" icon={Eye} trend="up" trendValue="0.43%" colorClass="bg-indigo-500" />
                  <StatCard title="Total Profit" value={formatPrice(45200000).replace("Rp", "")} icon={DollarSign} trend="up" trendValue="4.35%" colorClass="bg-emerald-500" />
                  <StatCard title="Total Product" value="2.450" icon={ShoppingBag} trend="up" trendValue="2.59%" colorClass="bg-lumer shadow-sm" />
                  <StatCard title="Total Users" value="3.456" icon={Users} trend="down" trendValue="0.95%" colorClass="bg-slate-400" />
                </div>

                {/* CHARTS LAYER */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[500px]">
                   {/* Main Performance Chart */}
                   <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                         <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase">Sales Analysis</h3>
                            <p className="text-xs font-bold text-slate-400 italic">01.01.2026 - 31.12.2026</p>
                         </div>
                         <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-slate-100 italic-none">
                            <button className="px-5 py-2 bg-white rounded-lg shadow-sm text-xs font-black uppercase text-slate-900 border border-slate-50">Day</button>
                            <button className="px-5 py-2 text-xs font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Week</button>
                         </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                         <div className="flex gap-10 mb-8 px-4">
                            <div className="flex items-center gap-2">
                               <div className="w-4 h-4 bg-lumer rounded-full" />
                               <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-4 h-4 bg-slate-300 rounded-full" />
                               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Expenses</span>
                            </div>
                         </div>
                         <div className="h-64 w-full relative">
                            <svg viewBox="0 0 400 100" className="w-full h-full">
                               <path d="M0,80 Q50,40 100,60 T200,30 T300,70 T400,20" fill="none" stroke="#FFBC11" strokeWidth="6" strokeLinecap="round" />
                               <path d="M0,90 Q50,70 100,80 T200,60 T300,85 T400,50" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-4">
                               <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Distribution / Side Card */}
                   <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col relative overflow-hidden">
                      <h3 className="text-xl font-black text-slate-900 uppercase mb-10">Inventory Sync</h3>
                      <div className="flex-1 flex flex-col justify-center items-center py-10 relative z-10">
                         <div className="relative w-48 h-48 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[18px] border-slate-50" />
                            <div className="absolute inset-0 rounded-full border-[18px] border-lumer border-t-transparent border-r-transparent animate-spin-slow rotate-[45deg]" />
                            <div className="text-center">
                               <p className="text-3xl font-black text-slate-900 tracking-tighter">78%</p>
                               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Stock Health</p>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4 mt-auto">
                        <div className="flex justify-between items-center text-xs font-bold">
                           <span className="text-slate-400 uppercase tracking-widest">Available</span>
                           <span className="text-slate-900">1,450 Units</span>
                        </div>
                        <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                           <div className="h-full bg-lumer w-[78%] rounded-full" />
                        </div>
                      </div>
                   </div>
                </div>

                {/* RECENT ORDERS TABLE */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900 uppercase">Recent System Logs</h3>
                      <button onClick={() => setActiveTab("Orders")} className="text-xs font-black uppercase text-lumer hover:underline flex items-center gap-1 group">
                         Matrix View <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <tr>
                            <th className="py-5 px-8">Order Profile</th>
                            <th className="py-5 px-4">Financials</th>
                            <th className="py-5 px-4">Logistics</th>
                            <th className="py-5 px-8 text-right">Channel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {orders.slice(0, 5).map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/50 transition-all group">
                               <td className="py-5 px-8">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black group-hover:bg-slate-900 group-hover:text-white transition-all text-sm">{o.customer_name.charAt(0)}</div>
                                     <div>
                                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{o.customer_name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {o.id.split('-')[0]}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="py-5 px-4">
                                  <p className="text-sm font-black text-slate-900">{formatPrice(o.total_price)}</p>
                               </td>
                               <td className="py-5 px-4">
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg ${statusConfig[o.status.toLowerCase()]?.bg} ${statusConfig[o.status.toLowerCase()]?.color}`}>
                                    {statusConfig[o.status.toLowerCase()]?.label}
                                  </span>
                               </td>
                               <td className="py-5 px-8 text-right">
                                  <p className="text-xs font-bold text-slate-400">{o.payment_method}</p>
                               </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </section>

              </motion.div>
            )}

            {activeTab === "Orders" && (
              <motion.section 
                key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-12"
              >
                 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 uppercase">System Order Pipeline</h2>
                      <p className="text-xs font-bold text-slate-400 mt-1 italic">Managing {filteredData.length} active transactions.</p>
                    </div>
                    <div className="flex gap-3">
                       <div className="relative">
                          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                          <select className="pl-10 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 outline-none hover:bg-slate-100 transition-all appearance-none cursor-pointer">
                             <option>All Status</option>
                             {Object.entries(statusConfig).map(([k,v]) => <option key={k} value={k}>{v.label.toUpperCase()}</option>)}
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
                          <tr>
                            <th className="py-6 px-8">Identification</th>
                            <th className="py-6 px-4">Inventory</th>
                            <th className="py-6 px-4">Financials</th>
                            <th className="py-6 px-4">Status Map</th>
                            <th className="py-6 px-8 text-right">Matrix Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {filteredData.map((order: any) => {
                             const status = statusConfig[order.status.toLowerCase()] || statusConfig.pending;
                             return (
                               <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                                 <td className="py-6 px-8">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black group-hover:bg-lumer transition-all shadow-sm">{order.customer_name.charAt(0)}</div>
                                       <div>
                                          <p className="font-bold text-sm text-slate-900 leading-none mb-1.5">{order.customer_name}</p>
                                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest opacity-60">ID: {order.id.split('-')[0]}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="py-6 px-4">
                                    <p className="text-xs font-medium text-slate-500 italic max-w-[250px] line-clamp-1">{order.order_items?.map((i: any) => `${i.quantity}x ${i.product_name}`).join(', ') || "No entries"}</p>
                                 </td>
                                 <td className="py-6 px-4">
                                    <p className="text-sm font-black text-slate-900">{formatPrice(order.total_price)}</p>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest opacity-60 mt-1">{order.payment_method}</p>
                                 </td>
                                 <td className="py-6 px-4">
                                    <div className="relative inline-block">
                                      <select 
                                        value={order.status.toLowerCase()}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        className={`text-[9px] font-black uppercase tracking-widest py-2.5 px-4 rounded-lg outline-none cursor-pointer border-none shadow-sm transition-all pr-8 ${status.bg} ${status.color} hover:shadow-md appearance-none`}
                                      >
                                        {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k} className="bg-white text-slate-900">{v.label.toUpperCase()}</option>)}
                                      </select>
                                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={10} />
                                    </div>
                                 </td>
                                 <td className="py-6 px-8 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                                       <a href={`/order/${order.id}`} target="_blank" className="w-9 h-9 flex items-center justify-center bg-white rounded-lg shadow-md border border-slate-100 text-slate-300 hover:text-slate-900 transition-all hover:scale-105 active:scale-95"><ExternalLink size={16} /></a>
                                       <button className="w-9 h-9 flex items-center justify-center bg-white rounded-lg shadow-md border border-slate-100 text-slate-300 hover:text-rose-500 transition-all hover:scale-105 active:scale-95"><Trash2 size={16} /></button>
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

            {["Products", "Categories", "Comments"].includes(activeTab) && (
              <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-20">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((item: any, i: number) => (
                       <div key={item.id || i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                          {activeTab === "Products" && (
                            <>
                               <div className="w-full h-40 bg-slate-50 rounded-xl overflow-hidden mb-6 border border-slate-50 relative">
                                  <img src={item.image_url || "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=300"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur rounded-lg shadow-sm text-[10px] font-black uppercase text-lumer">
                                     Stock: {item.stock || 0}
                                  </div>
                               </div>
                               <h4 className="text-lg font-black text-slate-900 leading-tight mb-1 truncate">{item.name}</h4>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Segment: {item.category?.name || "Premium"}</p>
                               <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-4">
                                  <p className="text-base font-black text-lumer">{formatPrice(item.price)}</p>
                                  <div className="flex gap-2">
                                     <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><Edit size={16} /></button>
                                     <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                                  </div>
                               </div>
                            </>
                          )}

                          {activeTab === "Categories" && (
                             <div className="flex flex-col items-center py-10">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 group-hover:bg-lumer group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-inner">
                                   <Layers size={32} />
                                </div>
                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">{item.name}</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-8">Active segment</p>
                                <div className="w-full flex gap-3">
                                   <button className="flex-1 h-12 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lumer transition-all">Config</button>
                                   <button className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all shadow-sm"><Trash2 size={18} /></button>
                                </div>
                             </div>
                          )}

                          {activeTab === "Comments" && (
                             <div className="flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                   <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden ring-2 ring-white shadow-sm">
                                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`} alt="User" />
                                   </div>
                                   <div>
                                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Client Sync</p>
                                      <p className="text-[10px] text-slate-400 font-bold italic">{new Date(item.created_at).toLocaleDateString()}</p>
                                   </div>
                                </div>
                                <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-8 indent-4">"{item.content}"</p>
                                <div className="mt-auto flex items-center justify-between text-slate-300">
                                   <div className="flex items-center gap-0.5">
                                      {[1,2,3,4,5].map(v => <StarIcon key={v} size={10} className={v <= (item.rating || 5) ? "text-lumer fill-current" : ""} />)}
                                   </div>
                                   <button className="hover:text-rose-500 p-2 transition-colors"><Trash2 size={16} /></button>
                                </div>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        @keyframes spin-slow {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        select { appearance: none; }
      `}</style>
    </div>
  );
}

const StarIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
