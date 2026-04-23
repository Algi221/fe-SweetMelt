"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Send, LogIn, LogOut, MessageSquare, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  user_name: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
  user_id: string;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Get current user
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // 2. Auth changes listener
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // 3. Initial fetch comments
    const fetchComments = async () => {
      setIsFetching(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      
      if (data) setComments(data);
      if (error) console.error("Error fetching comments:", error);
      setIsFetching(false);
    };
    fetchComments();

    // 4. Realtime subscription
    const channel = supabase
      .channel("live_comments_v1")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      authListener.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) toast.error("Gagal login dengan Google");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Gagal logout");
    else toast.success("Berhasil keluar");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Silakan login dengan Google untuk berkomentar");
      return;
    }
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
        user_name: user.user_metadata.full_name || user.email?.split('@')[0] || "Anonim",
        user_avatar: user.user_metadata.avatar_url || null,
        content: content.trim(),
      });

      if (error) throw error;
      setContent("");
      toast.success("Komentar terkirim!");
    } catch (error: any) {
      toast.error("Gagal mengirim: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-24 px-6" id="comments">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-lumer/10 px-4 py-2 rounded-full mb-4">
          <Flame size={16} className="text-lumer animate-pulse" />
          <span className="text-lumer font-bold text-xs uppercase tracking-widest">Live Chat Pelanggan</span>
        </div>
        <h2 className="section-title mb-4">Apa Kata <span className="text-lumer">Mereka?</span></h2>
        <p className="text-oreo-black/50 text-sm max-w-md mx-auto">
          Bagikan pengalaman manismu bersama SweetMelt di sini. Live & Real-time!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Input Card — 1 col */}
        <div className="lg:col-span-1">
          <div className="bg-oreo-black rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lumer/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-lumer/20 transition-all duration-700" />
            
            <h3 className="text-oreo-white font-display text-xl mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-lumer" />
              Tulis Pesan
            </h3>

            {user ? (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 mb-4 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <img src={user.user_metadata.avatar_url} alt="User" className="w-10 h-10 rounded-full border-2 border-lumer" />
                  <div className="min-w-0">
                    <p className="text-oreo-white text-xs font-bold truncate">{user.user_metadata.full_name}</p>
                    <button type="button" onClick={handleLogout} className="text-[10px] text-lumer hover:underline flex items-center gap-1">
                      <LogOut size={10} /> Logout
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ceritain rasa favoritmu..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-oreo-white text-sm focus:outline-none focus:border-lumer transition-colors resize-none placeholder:text-white/20"
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-sm shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Kirim Sekarang <Send size={16} /></>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 relative z-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                   <UserIcon />
                </div>
                <p className="text-oreo-white/60 text-xs mb-6 px-4">
                  Mau ikut ngobrol? Login dulu pakai akun Google kamu ya! 🍪
                </p>
                <button
                  onClick={handleLogin}
                  className="w-full py-4 rounded-2xl bg-white text-oreo-black font-bold text-sm flex items-center justify-center gap-3 hover:bg-oreo-cream transition-all shadow-xl"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
                  Login with Google
                </button>
                <p className="text-[10px] text-white/20 mt-4 italic">
                  Aman & Terverifikasi oleh Supabase Auth.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comments Feed — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-oreo-white border border-oreo-light rounded-3xl overflow-hidden shadow-oreo h-[500px] flex flex-col">
            <div className="p-4 border-b border-oreo-light bg-oreo-cream/30 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-oreo-black/40 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Feed
              </span>
              <span className="text-[10px] font-bold text-oreo-black/40">
                {comments.length} Komentar
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              <AnimatePresence initial={false}>
                {isFetching ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 opacity-20">
                     <div className="w-8 h-8 border-3 border-oreo-black border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 text-center gap-2">
                    <MessageSquare size={48} />
                    <p className="text-sm font-medium">Belum ada komentar. <br/> Jadi yang pertama menyapa!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="flex gap-4 items-start"
                    >
                      <div className="relative shrink-0">
                        {comment.user_avatar ? (
                          <img src={comment.user_avatar} alt="" className="w-10 h-10 rounded-full border-2 border-oreo-cream shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-oreo-cream flex items-center justify-center text-oreo-black/20">
                             <UserIcon size={18} />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                           <div className="w-2 h-2 bg-lumer rounded-full" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="bg-oreo-cream/30 rounded-2xl rounded-tl-none p-4 border border-oreo-light/50">
                          <div className="flex items-center justify-between mb-1 gap-2">
                             <span className="text-xs font-bold text-oreo-black truncate uppercase tracking-tighter">{comment.user_name}</span>
                             <span className="text-[9px] text-oreo-black/30 font-medium shrink-0">
                               {new Date(comment.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                             </span>
                          </div>
                          <p className="text-oreo-black/70 text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function UserIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
