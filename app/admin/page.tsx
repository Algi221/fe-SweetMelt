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
  PieChart,
  Home,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone
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
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
  >
    <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-lg`}>
      <Icon size={24} className="text-white" />
    </div>
    <div className="flex flex-col">
      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
      <p className="text-[11px] font-black p-2 bg-slate-50 rounded-lg uppercase tracking-widest text-slate-400 mt-2 self-start">{title}</p>
    </div>
    <div className="mt-6 flex items-center gap-1.5 border-t border-slate-50 pt-4">
      <div className={`flex items-center gap-0.5 text-xs font-black ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trendValue}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">momentum</span>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  // Settings State
  const [settings, setSettings] = useState({
    shopName: "SweetMelt Premium",
    maintenanceMode: false,
    notifications: true,
    autoRefresh: true
  });

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
      toast.error("Cloud Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (!error) {
        toast.success(`Matrix Updated: ${newStatus}`);
        fetchAllData();
      }
    } catch (e) {
      toast.error("Operation Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    toast.success("Logging out...");
    router.push("/"); // Redirect to Home
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  // --- Dynamic Stats Calculation ---
  const stats = useMemo(() => {
    const totalRevenue = orders.filter(o => o.status !== 'failed').reduce((acc, o) => acc + (o.total_price || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = new Set(orders.map(o => o.customer_name)).size;

    return {
      revenue: formatPrice(totalRevenue).replace("Rp", "Rp "),
      orders: totalOrders.toString(),
      products: totalProducts.toString(),
      users: totalUsers.toString()
    };
  }, [orders, products]);

  // --- Chart Data Logic (Last 7 Days) ---
  const chartPoints = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const records = Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      const dayStr = days[d.getDay()];
      const dayOrders = orders.filter(o => {
        const oDate = new Date(o.created_at);
        return oDate.getDate() === d.getDate() && oDate.getMonth() === d.getMonth();
      });
      const revenue = dayOrders.reduce((sum, o) => sum + (o.total_price || 0), 0) / 100000; // Normalized for chart
      return { label: dayStr, value: Math.min(revenue, 90) + 10 }; // Scale for SVG viewbox
    });
    return records;
  }, [orders]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (activeTab === "Dashboard" || activeTab === "Orders") return orders.filter(o => o.customer_name.toLowerCase().includes(term) || o.id.toLowerCase().includes(term));
    if (activeTab === "Products") return products.filter(o => o.name.toLowerCase().includes(term));
    if (activeTab === "Categories") return categories.filter(o => o.name.toLowerCase().includes(term));
    if (activeTab === "Comments") return comments.filter(o => o.content?.toLowerCase().includes(term));
    return [];
  }, [activeTab, searchTerm, orders, products, categories, comments]);

  const svgPath = useMemo(() => {
    if (chartPoints.length === 0) return "";
    const step = 400 / (chartPoints.length - 1);
    return chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * step},${100 - p.value}`).join(' ');
  }, [chartPoints]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-950 h-screen fixed left-0 top-0 text-slate-400 flex flex-col z-[100] transition-all border-r border-white/5">
        <div className="p-10 pb-12 flex flex-col gap-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-lumer rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(255,184,0,0.4)] rotate-3">
                <ShieldCheck className="text-slate-950" size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tighter leading-none">Sweet<span className="text-lumer">Melt</span></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Admin Panel</span>
              </div>
           </div>
        </div>

        <div className="flex-1 px-6 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 px-4 opacity-50">System Matrix</p>
          <nav className="space-y-2">
            {[
              { name: "Dashboard", icon: LayoutDashboard },
              { name: "Orders", icon: ShoppingBag, badge: orders.filter(o => o.status === 'pending').length },
              { name: "Products", icon: Package },
              { name: "Categories", icon: Layers },
              { name: "Comments", icon: MessageSquare },
              { name: "Settings", icon: Settings },
            ].map((item) => (
              <button 
                key={item.name}
                onClick={() => { setActiveTab(item.name); setSearchTerm(""); }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.name ? 'bg-white/10 text-white shadow-xl translate-x-1' : 'hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={activeTab === item.name ? 'text-lumer transition-colors' : 'group-hover:text-lumer transition-colors'} />
                  <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="bg-lumer text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-lg shadow-lumer/20">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8 mt-auto border-t border-white/5">
           <button onClick={() => router.push("/")} className="w-full mb-4 flex items-center gap-3 px-5 py-3 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all text-xs font-bold">
              <Home size={16} /> Home Landing
           </button>
           <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-lumer overflow-hidden border-2 border-white/10 shadow-xl flex items-center justify-center font-black text-slate-950">A</div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-black text-white truncate leading-none mb-1">Master Admin</p>
                 <p className="text-[10px] text-lumer/60 font-black uppercase tracking-widest leading-none">Super User</p>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-rose-500 p-2 transition-colors bg-white/5 rounded-xl">
                 <LogOut size={16} />
              </button>
           </div>
        </div>
      </aside>

      {/* CONTENT OFFSET */}
      <main className="flex-1 ml-72 flex flex-col h-screen">
        
        {/* HEADER */}
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-50">
          <div className="flex items-center gap-6">
             <div className="text-xs font-black uppercase tracking-widest text-slate-300">System Path</div>
             <ChevronRight size={14} className="text-slate-200" />
             <div className="text-xs font-black uppercase tracking-widest text-slate-900">{activeTab}</div>
          </div>

          <div className="flex items-center gap-8">
             <div className="relative group max-w-sm hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Search infrastructure..."
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-lumer/30 transition-all placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-4">
                <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-950 border border-slate-100 shadow-sm transition-all hover:scale-105 active:scale-95"><Bell size={20} /></button>
                <div className="h-10 w-[1px] bg-slate-100" />
                <button onClick={fetchAllData} className="flex items-center gap-3 px-7 h-12 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-lumer hover:text-slate-950 transition-all active:scale-95 shadow-xl shadow-slate-950/10">
                   <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                   {loading ? "Sync" : "Sync Sync"}
                </button>
             </div>
          </div>
        </header>

        {/* CONTAINER */}
        <div className="p-12 pb-20 flex-1 overflow-y-auto custom-scrollbar">
          
          <AnimatePresence mode="wait">
            {activeTab === "Dashboard" && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                
                {/* HERO STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Liquidity" value={stats.revenue} icon={DollarSign} trend="up" trendValue="12.4%" colorClass="bg-emerald-500" />
                  <StatCard title="Deployments" value={stats.orders} icon={ShoppingBag} trend="up" trendValue="8.1%" colorClass="bg-lumer" />
                  <StatCard title="Inventory" value={stats.products} icon={Package} trend="up" trendValue="2.3%" colorClass="bg-indigo-500" />
                  <StatCard title="Network" value={stats.users} icon={Users} trend="down" trendValue="1.5%" colorClass="bg-rose-500" />
                </div>

                {/* VISUAL ANALYTICS */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                   
                   {/* Interactive SVG Chart */}
                   <div className="xl:col-span-2 bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm flex flex-col group relative overflow-hidden">
                      <div className="flex items-center justify-between mb-12 relative z-10">
                         <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Revenue Trajectory</h3>
                            <p className="text-xs font-black text-slate-300 uppercase tracking-widest mt-1">Matrix Analysis • Last 7 Cycles</p>
                         </div>
                         <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <button className="px-6 py-2.5 bg-white rounded-xl shadow-md text-[10px] font-black uppercase text-slate-900 border border-slate-50">Realtime</button>
                            <button className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">History</button>
                         </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-end relative z-10">
                         <div className="h-64 w-full relative group/chart">
                            <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible pointer-events-none">
                               <defs>
                                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FFB800" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#FFB800" stopOpacity="0" />
                                  </linearGradient>
                               </defs>
                               <path d={`${svgPath} L400,100 L0,100 Z`} fill="url(#chartFill)" />
                               <motion.path 
                                 initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }}
                                 d={svgPath} fill="none" stroke="#FFB800" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
                               />
                               {chartPoints.map((p, i) => (
                                 <g key={i} className="pointer-events-auto cursor-pointer" onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                                    <motion.circle 
                                      cx={i * (400 / 6)} cy={100 - p.value} r={hoveredPoint === i ? 10 : 6} fill="#FFB800" stroke="white" strokeWidth={hoveredPoint === i ? 4 : 3} className="shadow-2xl transition-all"
                                    />
                                 </g>
                               ))}
                            </svg>
                            <div className="absolute inset-x-0 -bottom-8 flex justify-between px-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                               {chartPoints.map((p, i) => <span key={i}>{p.label}</span>)}
                            </div>

                            {/* Tooltip Simulation */}
                            <AnimatePresence>
                               {hoveredPoint !== null && (
                                 <motion.div 
                                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                   style={{ left: `${hoveredPoint * (100 / 6)}%` }}
                                   className="absolute top-0 -translate-x-1/2 bg-slate-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl pointer-events-none z-50 whitespace-nowrap"
                                 >
                                    Value: {(chartPoints[hoveredPoint].value * 100).toLocaleString()} / Cycle
                                 </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                      </div>
                      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-slate-50 rounded-full blur-[100px] opacity-40 shrink-0" />
                   </div>

                   {/* Inventory Distribution */}
                   <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm flex flex-col relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">System Pulse</h3>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100"><Smartphone size={18} /></div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center items-center py-6">
                         <div className="relative w-44 h-44 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90 transform">
                               <circle cx="88" cy="88" r="70" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-slate-50" />
                               <motion.circle 
                                 initial={{ strokeDashoffset: 440 }} animate={{ strokeDashoffset: 440 - (440 * 0.75) }} transition={{ duration: 1.5, ease: "easeOut" }}
                                 cx="88" cy="88" r="70" stroke="currentColor" strokeWidth="18" fill="transparent" strokeDasharray="440" className="text-lumer" 
                               />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                               <span className="text-4xl font-black text-slate-900 tracking-tighter">75%</span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Optimum</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4 mt-8">
                         <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-60">
                            <span>Efficiency</span>
                            <span>High Performance</span>
                         </div>
                         <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} className="h-full bg-lumer rounded-full shadow-[0_0_15px_rgba(255,184,0,0.5)]" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* LOGS PREVIEW */}
                <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900 uppercase">Recent System Cycles</h3>
                      <button onClick={() => setActiveTab("Orders")} className="text-xs font-black uppercase tracking-widest text-lumer hover:underline flex items-center gap-2 group">
                         Complete Logs <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                          <tr>
                            <th className="py-6 px-10">Matrix ID</th>
                            <th className="py-6 px-4">Financials</th>
                            <th className="py-6 px-4">Logistics</th>
                            <th className="py-6 px-10 text-right">Synchronization</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {orders.slice(0, 5).map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/50 transition-all group">
                               <td className="py-7 px-10">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">{o.customer_name.charAt(0)}</div>
                                     <div>
                                        <p className="text-sm font-black text-slate-900 mb-0.5">{o.customer_name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">NODE #{o.id.split('-')[0]}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="py-7 px-4">
                                  <p className="text-sm font-black text-slate-900 tracking-tight">{formatPrice(o.total_price)}</p>
                               </td>
                               <td className="py-7 px-4">
                                  <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-5 py-2.5 rounded-xl ${statusConfig[o.status.toLowerCase()]?.bg} ${statusConfig[o.status.toLowerCase()]?.color} shadow-sm inline-block`}>
                                    {statusConfig[o.status.toLowerCase()]?.label}
                                  </span>
                               </td>
                               <td className="py-7 px-10 text-right">
                                  <p className="text-xs font-bold text-slate-400 opacity-60 italic">{o.payment_method}</p>
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
              <motion.section key="orders" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-12">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase p-2 border-l-4 border-lumer pl-6">Logistics Matrix</h2>
                      <p className="text-xs font-bold text-slate-400 mt-2 ml-6 italic tracking-tight underline decoration-lumer/30 underline-offset-4">Analyzing {filteredData.length} sequence records.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="relative group">
                          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lumer transition-colors" size={16} />
                          <select className="pl-12 pr-12 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none hover:shadow-xl hover:-translate-y-0.5 transition-all appearance-none cursor-pointer">
                             <option>Matrix State: All</option>
                             {Object.entries(statusConfig).map(([k,v]) => <option key={k} value={k}>{v.label.toUpperCase()}</option>)}
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="overflow-x-auto px-6">
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                          <tr>
                            <th className="py-8 px-6 underline decoration-slate-100 underline-offset-[12px]">Identification</th>
                            <th className="py-8 px-4">Inventory Data</th>
                            <th className="py-8 px-4">Financials</th>
                            <th className="py-8 px-4">Status Map</th>
                            <th className="py-8 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {filteredData.map((order: any) => {
                             const status = statusConfig[order.status.toLowerCase()] || statusConfig.pending;
                             return (
                               <tr key={order.id} className="group hover:bg-slate-50/70 transition-all duration-300">
                                 <td className="py-10 px-6">
                                    <div className="flex items-center gap-5">
                                       <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black group-hover:bg-lumer transition-all shadow-md transform rotate-3 group-hover:rotate-0">{order.customer_name.charAt(0)}</div>
                                       <div>
                                          <p className="font-black text-sm text-slate-900 tracking-tight leading-none mb-1.5 underline decoration-transparent group-hover:decoration-lumer transition-all">{order.customer_name}</p>
                                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest opacity-60 italic">CYC-{order.id.split('-')[0]}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="py-10 px-4">
                                    <p className="text-xs font-bold text-slate-400 italic max-w-[280px] line-clamp-1 group-hover:text-slate-600 transition-colors">
                                      {order.order_items?.map((i: any) => `${i.quantity}x ${i.product_name}`).join(', ') || "NULL ENTRIES"}
                                    </p>
                                 </td>
                                 <td className="py-10 px-4">
                                    <p className="text-base font-black text-slate-950 tracking-tighter">{formatPrice(order.total_price)}</p>
                                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest opacity-50 mt-1">{order.payment_method}</p>
                                 </td>
                                 <td className="py-10 px-4">
                                    <div className="relative inline-block">
                                      <select 
                                        value={order.status.toLowerCase()}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        className={`text-[9px] font-black uppercase tracking-widest py-3 px-6 rounded-xl outline-none cursor-pointer border-none shadow-sm transition-all pr-10 ${status.bg} ${status.color} hover:shadow-2xl hover:-translate-y-1 appearance-none`}
                                      >
                                        {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k} className="bg-white text-slate-900">{v.label.toUpperCase()}</option>)}
                                      </select>
                                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover:opacity-100 transition-opacity" size={10} />
                                    </div>
                                 </td>
                                 <td className="py-10 px-6 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                       <a href={`/order/${order.id}`} target="_blank" className="w-11 h-11 flex items-center justify-center bg-white rounded-2xl shadow-xl border border-slate-100 text-slate-300 hover:text-slate-950 transition-all hover:scale-110 active:scale-95"><ExternalLink size={20} /></a>
                                       <button className="w-11 h-11 flex items-center justify-center bg-white rounded-2xl shadow-xl border border-slate-100 text-slate-300 hover:text-rose-500 transition-all hover:scale-110 active:scale-95"><Trash2 size={20} /></button>
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

            {activeTab === "Settings" && (
              <motion.section key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-10 pb-20">
                 <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-12">
                     <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-10 flex items-center gap-4">
                        <Settings className="text-lumer p-1.5 bg-slate-50 rounded-xl" size={40} /> System Configuration
                     </h2>

                     <div className="space-y-12">
                        {/* Shop Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Deployment Base Name</label>
                              <input 
                                type="text"
                                value={settings.shopName}
                                onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-lumer/30 transition-all"
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Admin Frequency</label>
                              <div className="flex items-center gap-4 h-[60px] bg-slate-50 rounded-2xl px-6">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex-1">Auto Refresh Data</span>
                                 <div 
                                   onClick={() => setSettings({...settings, autoRefresh: !settings.autoRefresh})}
                                   className={`w-14 h-8 rounded-full relative cursor-pointer transition-all duration-300 ${settings.autoRefresh ? 'bg-lumer' : 'bg-slate-200'}`}
                                 >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.autoRefresh ? 'left-7' : 'left-1'}`} />
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Security & System */}
                        <div className="bg-slate-950 rounded-[32px] p-10 text-white relative overflow-hidden">
                           <div className="relative z-10">
                              <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                                 <ShieldCheck className="text-lumer" /> Security Protocol
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                                    <div>
                                       <p className="text-xs font-black uppercase tracking-widest leading-none mb-2">Maintenance Mode</p>
                                       <p className="text-[10px] text-white/40 font-bold opacity-60">Block all public requests</p>
                                    </div>
                                    <div 
                                      onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-white/10'}`}
                                    >
                                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                                    </div>
                                 </div>
                                 <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                                    <div>
                                       <p className="text-xs font-black uppercase tracking-widest leading-none mb-2">Global Notifications</p>
                                       <p className="text-[10px] text-white/40 font-bold opacity-60">Real-time system pings</p>
                                    </div>
                                    <div 
                                      onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${settings.notifications ? 'bg-emerald-500' : 'bg-white/10'}`}
                                    >
                                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.notifications ? 'left-7' : 'left-1'}`} />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lumer/10 rounded-full blur-[80px]" />
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-100">
                           <button onClick={() => { localStorage.setItem("admin_settings", JSON.stringify(settings)); toast.success("System Records Updated"); }} className="h-14 px-12 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-lumer hover:text-slate-950 transition-all transform active:scale-95">
                              Commit Changes
                           </button>
                        </div>
                     </div>
                 </div>
              </motion.section>
            )}

            {["Products", "Categories", "Comments"].includes(activeTab) && (
              <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8 pb-20">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((item: any, i: number) => (
                       <div key={item.id || i} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                          {activeTab === "Products" && (
                            <>
                               <div className="w-full h-44 bg-slate-100 rounded-2xl overflow-hidden mb-8 relative border border-slate-50">
                                  <img src={item.image_url || "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=300"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950/80 backdrop-blur rounded-xl shadow-lg text-[10px] font-black uppercase text-lumer border border-white/10">
                                     STOCK: {item.stock || 0}
                                  </div>
                               </div>
                               <h4 className="text-lg font-black text-slate-900 leading-tight mb-2 truncate underline decoration-transparent group-hover:decoration-lumer transition-all decoration-2 underline-offset-4">{item.name}</h4>
                               <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-6 px-3 py-1.5 bg-slate-50 rounded-lg inline-block">{item.category?.name || "SYS-NODE"}</p>
                               <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-2">
                                  <p className="text-lg font-black text-slate-950 tracking-tighter">{formatPrice(item.price)}</p>
                                  <div className="flex gap-1.5">
                                     <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 hover:text-slate-900 transition-all hover:bg-white hover:shadow-md"><Edit size={16} /></button>
                                     <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 hover:text-rose-500 transition-all hover:bg-white hover:shadow-md"><Trash2 size={16} /></button>
                                  </div>
                               </div>
                            </>
                          )}

                          {activeTab === "Categories" && (
                             <div className="flex flex-col items-center py-10">
                                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 mb-8 group-hover:bg-lumer group-hover:text-slate-900 group-hover:rotate-[15deg] transition-all duration-700 shadow-inner ring-1 ring-slate-100">
                                   <Layers size={36} />
                                </div>
                                <h4 className="text-xl font-black text-slate-950 uppercase tracking-tighter mb-2">{item.name}</h4>
                                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] mb-10">System Architecture</p>
                                <div className="w-full flex gap-3">
                                   <button className="flex-1 h-14 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-lumer hover:text-slate-950 transition-all shadow-xl shadow-slate-950/10">Configure</button>
                                   <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all shadow-sm"><Trash2 size={20} /></button>
                                </div>
                             </div>
                          )}

                          {activeTab === "Comments" && (
                             <div className="flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-8">
                                   <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden ring-4 ring-white shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`} alt="User" />
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black text-slate-950 uppercase tracking-widest leading-none mb-1.5">Client Feed</p>
                                      <p className="text-[10px] text-slate-300 font-bold italic">{new Date(item.created_at).toLocaleDateString()}</p>
                                   </div>
                                </div>
                                <div className="flex-1 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8 border-dashed">
                                   <p className="text-sm font-semibold text-slate-600 leading-relaxed italic">"{item.content}"</p>
                                </div>
                                <div className="mt-auto flex items-center justify-between text-slate-300 bg-white pt-4">
                                   <div className="flex items-center gap-1">
                                      {[1,2,3,4,5].map(v => <StarIcon key={v} size={11} className={v <= (item.rating || 5) ? "text-lumer fill-current" : "text-slate-100"} />)}
                                   </div>
                                   <button className="hover:text-rose-500 p-2 transition-all hover:bg-rose-50 rounded-xl"><Trash2 size={16} /></button>
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
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        select { appearance: none; }
      `}</style>
    </div>
  );
}

const StarIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
