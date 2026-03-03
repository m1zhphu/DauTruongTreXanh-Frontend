import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, X, Info, Loader2, ArrowLeft, Gem, Star, Sparkles, Zap, 
  Coins, CircleDollarSign 
} from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import httpAxios from "../../../services/httpAxios";
import API_BASE_URL from "../../../services/apiConfig";

import RICE_POUR_IMG from "../../../assets/tui_thoc.png"; 

// --- 0. HELPER: XỬ LÝ URL ẢNH ---
const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    const baseURL = API_BASE_URL.replace(/\/api\/?$/, ""); 
    return `${baseURL}${path}`;
};

// --- HELPER: STYLE ---
const getRarityStyle = (rarity) => {
    const safeRarity = rarity ? rarity.toUpperCase() : 'COMMON';
    switch(safeRarity) {
        case 'LEGENDARY': return { border: 'border-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-400', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' };
        case 'RARE': return { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400', shadow: 'shadow-[0_0_10px_rgba(168,85,247,0.3)]' };
        default: return { border: 'border-slate-700', bg: 'bg-slate-800/50', text: 'text-slate-400', shadow: '' };
    }
};

// --- 1. COMPONENT BACKGROUND ---
const GalaxyBackground = () => {
    const meteors = useMemo(() => [...Array(8)].map((_, i) => ({
        id: i,
        width: 100 + (i * 20) % 100,
        top: `${(i * 15) % 100}%`,
        left: `${(i * 25) % 100}%`,
        duration: 3 + (i % 3),
        delay: i * 0.5
    })), []);

    return (
        <div className="fixed inset-0 z-0 bg-[#050505] overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#1b1029] via-[#090910] to-[#000000]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at center, black, transparent 80%)' }}></div>
            {meteors.map((meteor) => (
                 <motion.div
                    key={meteor.id}
                    className="absolute h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-0 shadow-[0_0_10px_cyan]"
                    style={{ width: meteor.width, top: meteor.top, left: meteor.left }}
                    animate={{ x: [-300, window.innerWidth], opacity: [0, 1, 0] }}
                    transition={{ duration: meteor.duration, repeat: Infinity, delay: meteor.delay, ease: "linear" }}
                 />
            ))}
        </div>
    );
};

// --- 2. VÒNG QUAY SIÊU CẤP ---
const AdvancedMagicCircle = ({ isSpinning }) => (
    <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] flex items-center justify-center">
        <motion.div className="absolute inset-0 rounded-full bg-amber-500/20 blur-[60px]" animate={isSpinning ? { scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 0.2 }} transition={{ duration: 1, repeat: Infinity }} />
        <motion.div className="absolute inset-0 border border-slate-600/30 rounded-full" animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
            {[...Array(12)].map((_, i) => <div key={i} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-amber-500/50 to-transparent" style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: "50% 50% 190px" }} />)}
        </motion.div>
        <motion.div className="absolute inset-8 rounded-full border-[4px] border-transparent border-t-amber-400 border-b-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]" animate={isSpinning ? { rotate: 3600 } : { rotate: 360 }} transition={{ duration: isSpinning ? 10 : 20, ease: "linear", repeat: Infinity }} />
        <motion.div className="relative w-40 h-40 md:w-52 md:h-52 bg-black rounded-full flex items-center justify-center z-10 border-4 border-slate-800 shadow-inner" animate={isSpinning ? { scale: [1, 0.98, 1] } : {}} transition={{ duration: 0.1, repeat: Infinity }}>
            <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div className="w-full h-full bg-[conic-gradient(from_180deg,transparent_0deg,#f59e0b_180deg,transparent_360deg)] opacity-40" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
            </div>
            <motion.div className="relative z-20" animate={isSpinning ? { scale: [1, 1.2, 1], filter: ["brightness(1)", "brightness(2)", "brightness(1)"] } : {}} transition={{ duration: 0.5, repeat: Infinity }}>
                <Gem size={64} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
            </motion.div>
            <AnimatePresence>
                {isSpinning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute w-[120%] h-[120%] border-2 border-white/50 rounded-full animate-ping opacity-20"></div>
                        <Zap className="absolute -top-4 right-0 text-white w-6 h-6 animate-pulse" />
                        <Zap className="absolute -bottom-4 left-0 text-white w-6 h-6 animate-pulse delay-75" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </div>
);

// --- MAIN SCREEN ---
const GachaScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reward, setReward] = useState(null);
  
  // State Tiền tệ
  const [userRice, setUserRice] = useState(0); 
  const [userQuanTien, setUserQuanTien] = useState(0); 

  const [pool, setPool] = useState([]); 
  const [inventory, setInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);

  const riceParticles = useMemo(() => [...Array(15)].map((_, i) => ({
      id: i,
      x: ((i % 5) - 2) * 20, 
      delay: i * 0.05
  })), []);

  // --- DATA FETCHING ---
  const fetchUserData = async () => {
      try {
          const balRes = await httpAxios.get("/gacha/balance");
          setUserRice(balRes.data.rice || 0);
          setUserQuanTien(balRes.data.quanTien || 0); // Lấy cả Quan Tiền
      } catch  { /* silent fail */ }
  };

  useEffect(() => {
    const initData = async () => {
        try {
            const poolRes = await httpAxios.get("/gacha/pool");
            const sortedPool = poolRes.data.sort((a, b) => {
                const order = { 'LEGENDARY': 1, 'RARE': 2, 'COMMON': 3 };
                return (order[a.rarity] || 99) - (order[b.rarity] || 99);
            });
            setPool(sortedPool);
            await fetchUserData(); 
        } catch  { /* silent fail */ }
    };
    initData();
  }, []);

  const fetchInventory = async () => {
      try {
          const res = await httpAxios.get("/gacha/inventory");
          const validItems = res.data.filter(slot => slot && slot.item);
          setInventory(validItems);
          setShowInventory(true);
      } catch  { 
          alert("Lỗi tải túi đồ!"); 
      }
  };

  // --- SPIN LOGIC (Update hỗ trợ 2 loại tiền) ---
  const handleSpin = async (useQuanTien) => {
    // 1. Validate số dư Client-side
    if (useQuanTien) {
        if (userQuanTien < 10) return alert("❌ Cần 10 Quan Tiền để quay VIP!");
    } else {
        if (userRice < 100) return alert("❌ Cần 100 Lúa để quay thường!");
    }
    
    setLoading(true);
    setReward(null);

    try {
      // 2. Gọi API với tham số useQuanTien
      const res = await httpAxios.post(`/gacha/spin?useQuanTien=${useQuanTien}`);
      const item = res.data;

      setTimeout(async () => {
        setReward(item);
        await fetchUserData(); // Cập nhật lại ví
        setLoading(false);
      }, 3000);

    } catch (err) {
      alert("Lỗi: " + (err.response?.data || "Thất bại"));
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex font-sans text-white relative overflow-hidden bg-[#050505]">
      <GalaxyBackground />

      {/* --- LEFT SIDEBAR (Desktop Only) --- */}
      <div className="hidden lg:flex w-80 h-full flex-col bg-[#0a0a12]/80 backdrop-blur-2xl border-r border-white/5 z-20 shadow-2xl">
          <div className="p-6 border-b border-white/5">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition group mb-6">
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Quay lại
              </button>
              <h2 className="text-2xl font-black flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase tracking-widest">
                  <Info size={24} className="text-amber-500"/> Vật Phẩm
              </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {pool.map((item) => {
                  const style = getRarityStyle(item.rarity);
                  return (
                      <div key={item.id} className={`flex items-center gap-4 p-3 rounded-xl border bg-gradient-to-r from-transparent to-white/5 ${style.border} transition-all hover:scale-[1.02] cursor-default group`}>
                          <img src={getImageUrl(item.imageUrl)} alt={item.name} className="w-9 h-9 object-contain drop-shadow-md"/>
                          <div>
                              <h4 className={`text-sm font-bold ${style.text} line-clamp-1`}>{item.name}</h4>
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.rarity}</span>
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>

      {/* --- CENTER AREA --- */}
      <div className="flex-1 flex flex-col relative z-10 h-full">
        
        {/* Header Bar (Wallet) */}
        <div className="absolute top-0 w-full p-6 flex flex-col md:flex-row justify-between items-center md:items-start lg:justify-end z-30 gap-4 pointer-events-none">
            <button onClick={() => navigate('/')} className="lg:hidden p-3 bg-white/5 rounded-full pointer-events-auto"><ArrowLeft size={24}/></button>
            
            <div className="flex items-center gap-4 ml-auto pointer-events-auto">
                {/* Ví Lúa */}
                <div className="flex items-center gap-2 bg-[#151520]/90 px-4 py-2 rounded-full border border-amber-500/30 backdrop-blur-md shadow-lg">
                    <span className="text-xl">🌾</span>
                    <span className="text-lg font-black text-amber-400 font-mono">{userRice.toLocaleString()}</span>
                </div>
                {/* Ví Quan Tiền */}
                <div className="flex items-center gap-2 bg-[#151520]/90 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-md shadow-lg">
                    <CircleDollarSign size={20} className="text-cyan-400"/>
                    <span className="text-lg font-black text-cyan-400 font-mono">{userQuanTien.toLocaleString()}</span>
                </div>
                {/* Nút Túi Đồ */}
                <button onClick={fetchInventory} className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                    <Package size={20}/>
                </button>
            </div>
        </div>

        {/* Wheel Content */}
        <div className="flex-1 flex flex-col items-center justify-center pb-20 md:pb-0">
            <div className="text-center mb-8 relative z-10">
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tighter uppercase">Vòng Quay Luân Hồi</h1>
            </div>

            <div className="relative flex flex-col items-center">
                <AnimatePresence>
                    {loading && (
                        <motion.div initial={{ opacity: 0, y: -200, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="absolute -top-48 z-0 w-40 md:w-52 pointer-events-none">
                            <img src={RICE_POUR_IMG} alt="Pouring" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"/>
                            {riceParticles.map((p) => (
                                <motion.div key={p.id} className="absolute bottom-0 left-1/2 w-2 h-4 bg-white rounded-full shadow-[0_0_5px_white]" initial={{ y: 0, x: 0, opacity: 1 }} animate={{ y: 300, x: p.x, opacity: 0 }} transition={{ duration: 0.6, repeat: Infinity, delay: p.delay, ease: "easeIn" }} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AdvancedMagicCircle isSpinning={loading} />

                {/* --- ACTION BUTTONS (2 Options) --- */}
                <div className="mt-12 relative z-30 flex flex-col sm:flex-row gap-6">
                    
                    {/* Nút 1: Quay Thường (Lúa) */}
                    <button onClick={() => handleSpin(false)} disabled={loading} className={`group relative w-64 py-4 rounded-2xl font-bold transition-all transform flex flex-col items-center justify-center gap-1 border-2 border-amber-500/50 bg-[#1a1500]/80 hover:bg-amber-900/40 hover:scale-105 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="text-amber-400 text-lg uppercase tracking-wider flex items-center gap-2">
                            {loading ? <Loader2 className="animate-spin"/> : <Zap size={20}/>} Quay Thường
                        </div>
                        <div className="text-xs text-amber-200/70 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/30">100 Lúa</div>
                    </button>

                    {/* Nút 2: Quay VIP (Quan Tiền) */}
                    <button onClick={() => handleSpin(true)} disabled={loading} className={`group relative w-64 py-4 rounded-2xl font-bold transition-all transform flex flex-col items-center justify-center gap-1 border-2 border-cyan-500/50 bg-[#001a1a]/80 hover:bg-cyan-900/40 hover:scale-105 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[shimmer_2s_infinite]"></div>
                        </div>
                        <div className="text-cyan-400 text-lg uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                            {loading ? <Loader2 className="animate-spin"/> : <Sparkles size={20}/>} Quay VIP
                        </div>
                        <div className="text-xs text-cyan-200/70 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/30">10 Quan Tiền</div>
                    </button>

                </div>
            </div>
        </div>
      </div>

      {/* --- INVENTORY MODAL --- */}
      <AnimatePresence>
        {showInventory && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setShowInventory(false)}>
                <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} onClick={(e) => e.stopPropagation()} className="bg-[#151520] border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl relative">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#1a1a25]">
                        <h2 className="text-2xl font-black text-white flex items-center gap-2"><Package className="text-indigo-500"/> KHO ĐỒ</h2>
                        <button onClick={() => setShowInventory(false)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition"><X size={24}/></button>
                    </div>
                    <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-[#0f0f15] custom-scrollbar">
                        {inventory.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-500">Túi đồ trống trơn...</div>
                        ) : (
                            inventory.map((slot) => {
                                if (!slot.item) return null; 
                                const style = getRarityStyle(slot.item.rarity);
                                return (
                                    <div key={slot.id} className={`rounded-2xl p-4 flex flex-col items-center border bg-white/5 ${style.border} group hover:shadow-lg transition-all`}>
                                        <div className="w-full aspect-square mb-2 flex items-center justify-center rounded-xl bg-black/30">
                                            <img src={getImageUrl(slot.item.imageUrl)} alt={slot.item.name} className="w-2/3 object-contain group-hover:scale-110 transition-transform"/>
                                        </div>
                                        <div className="text-right w-full text-[10px] text-slate-400 mb-1">x{slot.quantity}</div>
                                        <h4 className={`text-xs font-bold text-center line-clamp-2 ${style.text}`}>{slot.item.name}</h4>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </motion.div>
             </motion.div>
        )}
      </AnimatePresence>

      {/* --- REWARD POPUP --- */}
      <AnimatePresence>
        {reward && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-6" onClick={() => setReward(null)}>
                <motion.div initial={{ scale: 0, rotateY: 180 }} animate={{ scale: 1, rotateY: 0 }} exit={{ scale: 0.5, opacity: 0 }} className="relative bg-[#15151a] border-[3px] border-amber-500 rounded-[2rem] p-8 text-center max-w-sm w-full shadow-[0_0_50px_rgba(245,158,11,0.5)]" onClick={(e) => e.stopPropagation()}>
                    <Sparkles size={48} className="text-yellow-400 mx-auto mb-4 animate-bounce"/>
                    <div className="w-48 h-48 bg-gradient-to-b from-[#2a2b3d] to-black rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[#3a3b4d]">
                        <img src={getImageUrl(reward.imageUrl)} alt={reward.name} className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"/>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 uppercase">{reward.name}</h2>
                    <div className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase mb-6 border ${getRarityStyle(reward.rarity).border} ${getRarityStyle(reward.rarity).text}`}>{reward.rarity}</div>
                    <button onClick={() => setReward(null)} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:scale-105 transition">THU THẬP</button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GachaScreen;