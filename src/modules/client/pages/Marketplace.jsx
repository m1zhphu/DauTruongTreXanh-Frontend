import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Store, Tag, Search, Filter, User, ArrowRight, 
  CircleDollarSign, Plus, X, Loader2, Mail, Sparkles, 
  ShoppingBag, Zap, TrendingUp, Info, HelpCircle, 
  GripVertical, PackageOpen, LayoutGrid, ShieldCheck,
  BookOpen, Package 
} from 'lucide-react';
import httpAxios from '../../../services/httpAxios';
import API_BASE_URL from '../../../services/apiConfig';

const Marketplace = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook để lấy params từ URL
  const [listings, setListings] = useState([]);
  const [userBalance, setUserBalance] = useState(null); 
  const [loading, setLoading] = useState(true);
  const stompClientRef = useRef(null);

  // --- STATES CHO VIỆC BÁN HÀNG ---
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellTab, setSellTab] = useState("ITEM"); // 'ITEM' hoặc 'TOPIC'
  
  const [inventory, setInventory] = useState([]); // Gacha items
  const [myTopics, setMyTopics] = useState([]);   // User created topics

  const [selectedAsset, setSelectedAsset] = useState(null); 
  const [sellPrice, setSellPrice] = useState("");
  const [sellQuantity, setSellQuantity] = useState(1); 
  
  const [isSelling, setIsSelling] = useState(false);
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState("");
  
  const [confirmModal, setConfirmModal] = useState({ show: false, data: null });

  // === HELPERS ===
  const getImageUrl = (url) => {
    if (!url || url === "default_avatar.png") return "https://cdn-icons-png.flaticon.com/512/679/679720.png";
    if (url.startsWith("http")) return url;
    const backendRoot = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${backendRoot}${url}`;
  };

  const getRarityStyle = (rarity) => {
    switch (rarity) {
        case 'LEGENDARY': return { 
          bg: 'bg-gradient-to-br from-amber-400/20 to-orange-500/20', 
          border: 'border-amber-400', 
          glow: 'shadow-[0_0_30px_rgba(251,191,36,0.5)]', 
          badge: 'bg-amber-500 text-white',
          animation: 'animate-pulse'
        };
        case 'RARE': return { 
          bg: 'bg-gradient-to-br from-blue-400/20 to-indigo-500/20', 
          border: 'border-blue-400', 
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]', 
          badge: 'bg-blue-500 text-white',
          animation: ''
        };
        default: return { 
          bg: 'bg-white/5', 
          border: 'border-white/10', 
          glow: '', 
          badge: 'bg-slate-600 text-white',
          animation: ''
        };
    }
  };

  // === API CALLS ===
  const fetchMarketData = useCallback(async () => {
    try {
      const res = await httpAxios.get('/market');
      setListings(res.data);
      setTimeout(() => setLoading(false), 800);
    } catch  { 
        toast.error("Chợ đang bảo trì!");
        setLoading(false); 
    }
  }, []);

  const fetchUserBalance = useCallback(async () => {
    const token = localStorage.getItem('client_token');
    if (!token) return; 
    try {
      const res = await httpAxios.get('/gacha/balance');
      setUserBalance(res.data.quanTien);
    } catch { }
  }, []);

  // ✅ SỬA LỖI Ở ĐÂY: Gọi đúng API /my-library và lấy list created
  const fetchMyAssets = async () => {
    try {
        const [invRes, topicRes] = await Promise.all([
            httpAxios.get('/gacha/inventory'),
            httpAxios.get('/questions/my-library') // <--- Đổi thành my-library
        ]);
        
        setInventory(invRes.data.filter(slot => slot && slot.item && slot.quantity > 0));
        
        // Vì /my-library trả về { created: [], purchased: [] }
        // Khi bán, ta chỉ lấy danh sách 'created' (những cái mình tạo ra)
        if (topicRes.data && topicRes.data.created) {
            setMyTopics(topicRes.data.created);
        } else {
            setMyTopics([]);
        }

    } catch (err) { 
        console.error("Lỗi fetch assets:", err);
        toast.error("Lỗi tải dữ liệu cá nhân!"); 
    }
  };

  // === WEBSOCKET ===
  useEffect(() => {
    fetchMarketData();
    fetchUserBalance();
    const socketUrl = API_BASE_URL.replace(/\/api\/?$/, "") + "/ws-game";
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        client.subscribe('/topic/market', (msg) => {
          const newListing = JSON.parse(msg.body);
          setListings(prev => [newListing, ...prev]);
          
          const itemName = newListing.listingType === 'TOPIC' 
                ? `Bộ đề: ${newListing.topic.name}` 
                : `Vật phẩm: ${newListing.item.name}`;
                
          toast.success(`Hàng mới lên kệ: ${itemName}`, { icon: '📦' });
        });
        
        client.subscribe('/topic/market/sold', (msg) => {
            setListings(prev => prev.filter(i => i.id !== JSON.parse(msg.body)));
        });
      },
    });
    client.activate();
    stompClientRef.current = client;
    return () => stompClientRef.current?.deactivate();
  }, [fetchMarketData, fetchUserBalance]);

  // === EFFECT: Xử lý URL Params để mở Modal tự động ===
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    const type = params.get('type');
    const id = params.get('id');

    if (action === 'sell' && id) {
        // Nếu có lệnh bán từ URL, mở modal và load dữ liệu
        if (!localStorage.getItem('client_token')) return navigate('/login');
        
        const autoOpenSell = async () => {
            await fetchMyAssets(); // Load dữ liệu trước
            setShowSellModal(true);
            setStep(1);
            
            // Tự động chọn tab và item
            if (type === 'TOPIC') {
                setSellTab('TOPIC');
                // Lưu ý: State myTopics chưa cập nhật ngay lập tức do bất đồng bộ
                // Nên logic auto-select item cụ thể sẽ phức tạp hơn, 
                // ở đây ta chỉ mở tab và list thôi cho đơn giản.
            } else {
                setSellTab('ITEM');
            }
        };
        autoOpenSell();
    }
  }, [location.search, navigate]);


  // === HANDLERS ===
  const handleOpenSellModal = () => {
      if (!localStorage.getItem('client_token')) return navigate('/login');
      fetchMyAssets();
      setShowSellModal(true);
      setStep(1);
      setSelectedAsset(null);
      setSellTab("ITEM"); // Default tab
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsSelling(true);
    try {
        await httpAxios.post('/market/sell/request-otp');
        toast.success("Mã phong ấn đã được gửi!");
        setStep(2);
    } catch  { toast.error("Gửi mã thất bại!"); }
    finally { setIsSelling(false); }
  };

  const handleConfirmSellWithOtp = async (e) => {
    e.preventDefault();
    setIsSelling(true);
    const ld = toast.loading("Đang niêm phong...");
    
    try {
        const payload = {
            otp: otpCode,
            price: sellPrice,
            quantity: sellTab === 'TOPIC' ? 1 : sellQuantity,
        };

        if (sellTab === 'ITEM') {
            payload.itemId = selectedAsset.item.id;
            await httpAxios.post('/market/sell', payload);
        } else {
            // API bán Topic
            payload.topicId = selectedAsset.id; // Thêm topicId vào payload
            await httpAxios.post('/market/sell-topic', payload);
        }

        toast.success("Mở sạp thành công!", { id: ld });
        setShowSellModal(false);
        fetchUserBalance();
        // Xóa params trên URL để tránh mở lại modal khi refresh
        navigate('/market-place', { replace: true });
    } catch (err) { 
        toast.error("Lỗi: " + (err.response?.data?.message || "Mã sai!"), { id: ld }); 
    }
    finally { setIsSelling(false); }
  };

  const triggerBuyConfirm = (listing) => {
    if (!localStorage.getItem('client_token')) return navigate('/login');
    if (userBalance < listing.price) return toast.error("Không đủ Quan Tiền!");
    setConfirmModal({ show: true, data: listing });
  };

  const handleBuyActual = async () => {
    const listing = confirmModal.data;
    setConfirmModal({ show: false, data: null });
    const ld = toast.loading(`Đang giao dịch...`);
    try {
        await httpAxios.post(`/market/buy/${listing.id}`);
        toast.success(`Giao dịch thành công!`, { id: ld });
        fetchUserBalance();
        fetchMarketData();
    } catch (err) { 
        toast.error(err.response?.data?.message || "Giao dịch thất bại!", { id: ld }); 
        fetchMarketData(); 
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
       <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
       </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-[#020617] font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      {/* FIXED BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#020617]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-900/20 rounded-full blur-[120px] animate-mesh-1"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[100px] animate-mesh-2"></div>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-[100] bg-slate-900/60 backdrop-blur-2xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
               <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
                  <Store size={24} />
               </div>
               <h1 className="text-xl font-black tracking-tighter uppercase text-white hidden sm:block italic">Chợ Huyện</h1>
            </div>

            <div className="flex items-center gap-4">
               {userBalance !== null && (
                  <div className="flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md animate-fade-in">
                     <CircleDollarSign size={18} className="text-amber-400 animate-pulse" />
                     <span className="text-lg font-black text-white">{userBalance.toLocaleString()}</span>
                  </div>
               )}
               <button onClick={handleOpenSellModal} className="px-6 py-2.5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-sm uppercase hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                  + Mở Sạp
               </button>
            </div>
          </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
          
          {/* HEADER */}
          <div className="mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
                 <Sparkles size={14}/> Sầm uất kinh kỳ
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                Phường Hội <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Buôn Bán</span>
              </h2>
              <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed animate-fade-in" style={{animationDelay: '0.1s'}}>
                  Hệ thống giao dịch ẩn danh bảo mật tuyệt đối. Mọi vật phẩm và bộ đề đều được triều đình niêm phong bảo chứng.
              </p>
          </div>

          {/* GRID LISTINGS */}
          {listings.length === 0 ? (
            <div className="py-40 flex flex-col items-center justify-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5 backdrop-blur-sm">
               <ShoppingBag size={48} className="text-slate-600 mb-4 animate-bounce" />
               <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest italic">Sạp hàng đang trống...</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {listings.map((listing, index) => {
                
                // --- RENDER THẺ TOPIC ---
                if (listing.listingType === 'TOPIC' && listing.topic) {
                    return (
                        <div 
                            key={listing.id} 
                            className="group bg-slate-900/40 rounded-[2.5rem] p-6 border border-blue-500/20 transition-all duration-500 hover:border-blue-400 hover:bg-slate-800/60 hover:-translate-y-2 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                            style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both` }}
                        >
                            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 mb-6 flex flex-col items-center justify-center relative border border-blue-500/10 group-hover:rotate-1 transition-transform duration-500">
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter z-10 bg-blue-500 text-white">
                                    BỘ ĐỀ
                                </div>
                                <BookOpen size={64} className="text-blue-400 drop-shadow-lg mb-2" strokeWidth={1.5} />
                                <div className="text-center px-4">
                                    <p className="text-xs font-bold text-blue-300">{listing.topic.totalKnots || 0} câu hỏi</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">{listing.topic.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 text-[10px]">
                                        <User size={12} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{listing.seller.name}</span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Giá chuyển nhượng</span>
                                        <div className="flex items-center gap-1.5 font-black text-2xl text-blue-400">
                                            {listing.price.toLocaleString()} <span className="text-sm text-blue-600">Q</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => triggerBuyConfirm(listing)}
                                        className="w-12 h-12 bg-white text-slate-950 rounded-2xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl active:scale-90"
                                    >
                                        <Tag size={22} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }

                // --- RENDER THẺ VẬT PHẨM (GACHA) ---
                if (listing.item) {
                    const style = getRarityStyle(listing.item.rarity);
                    return (
                      <div 
                        key={listing.id} 
                        className={`group bg-slate-900/40 rounded-[2.5rem] p-6 border border-white/5 transition-all duration-500 hover:border-emerald-500/40 hover:bg-slate-800/60 hover:-translate-y-2 ${style.glow}`}
                        style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both` }}
                      >
                        <div className={`aspect-square rounded-[2rem] ${style.bg} mb-6 flex items-center justify-center relative transition-transform duration-500 group-hover:rotate-1`}>
                           <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter z-10 ${style.badge} ${style.animation}`}>
                              {listing.item.rarity}
                           </div>
                           <img src={getImageUrl(listing.item.imageUrl)} className="w-3/4 h-3/4 object-contain drop-shadow-2xl group-hover:scale-110 transition-all duration-500" alt="" />
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-black text-white truncate group-hover:text-emerald-400 transition-colors uppercase tracking-tight italic">{listing.item.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 text-[10px]">
                               <User size={12} />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{listing.seller.name}</span>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Giá sở hữu</span>
                               <div className="flex items-center gap-1.5 font-black text-2xl text-emerald-400">
                                  {listing.price.toLocaleString()} <span className="text-sm text-emerald-600">Q</span>
                               </div>
                            </div>
                            <button 
                              onClick={() => triggerBuyConfirm(listing)}
                              className="w-12 h-12 bg-white text-slate-950 rounded-2xl flex items-center justify-center hover:bg-emerald-500 transition-all duration-300 shadow-xl active:scale-90"
                            >
                              <Tag size={22} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                }
                return null;
              })}
            </div>
          )}
      </div>

      {/* --- CONFIRM MODAL --- */}
      {confirmModal.show && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
              <div className="bg-[#0f172a] border border-white/10 rounded-[3rem] w-full max-w-sm p-10 text-center shadow-2xl animate-zoom-in">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                      <PackageOpen size={40} className="animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase italic">
                      Mua {confirmModal.data.listingType === 'TOPIC' ? 'Bộ đề' : 'Vật phẩm'}?
                  </h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                      Bạn có chắc muốn dùng <span className="text-emerald-400 font-black">{confirmModal.data.price} Quan</span> để tậu <span className="text-white font-black">{confirmModal.data.listingType === 'TOPIC' ? confirmModal.data.topic.name : confirmModal.data.item.name}</span>?
                  </p>
                  <div className="flex flex-col gap-3">
                      <button onClick={handleBuyActual} className="w-full py-4 bg-emerald-500 text-slate-950 rounded-2xl font-black uppercase hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">Xác nhận mua</button>
                      <button onClick={() => setConfirmModal({show:false, data:null})} className="w-full py-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">Huỷ giao kèo</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- SELL MODAL (ULTRA MODERN) --- */}
      {showSellModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="relative bg-[#0f172a] border border-white/10 rounded-[3.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-zoom-in flex flex-col max-h-[90vh]">
             
             {/* Header Modal */}
             <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/5 shrink-0">
                <h2 className="font-black text-xl text-white uppercase italic tracking-tighter">
                    {step === 1 ? "BÀY HÀNG RA CHỢ" : "XÁC THỰC GIAO DỊCH"}
                </h2>
                <button onClick={() => setShowSellModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all"><X size={20}/></button>
             </div>

             {/* Body Modal */}
             <div className="p-8 overflow-y-auto custom-scrollbar">
                {step === 1 ? (
                   !selectedAsset ? (
                      <>
                        {/* TABS CHỌN LOẠI HÀNG */}
                        <div className="flex bg-white/5 p-1 rounded-2xl mb-6">
                            <button 
                                onClick={() => setSellTab('ITEM')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sellTab === 'ITEM' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                <Package size={14} className="inline mr-2"/> Vật Phẩm
                            </button>
                            <button 
                                onClick={() => setSellTab('TOPIC')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sellTab === 'TOPIC' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                <BookOpen size={14} className="inline mr-2"/> Bộ Đề
                            </button>
                        </div>

                        {/* GRID SELECTOR */}
                        {sellTab === 'ITEM' ? (
                            inventory.length === 0 ? (
                                <p className="text-center text-slate-500 py-10">Túi đồ trống.</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {inventory.map(slot => (
                                        <button key={slot.id} onClick={() => setSelectedAsset(slot)} className="group p-4 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-center relative flex flex-col items-center">
                                            <img src={getImageUrl(slot.item.imageUrl)} className="w-14 h-14 mx-auto mb-2 object-contain group-hover:scale-110 transition-transform" alt="" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase truncate w-full">{slot.item.name}</p>
                                            <span className="absolute top-2 right-2 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">x{slot.quantity}</span>
                                        </button>
                                    ))}
                                </div>
                            )
                        ) : (
                            myTopics.length === 0 ? (
                                <p className="text-center text-slate-500 py-10">Bạn chưa tạo bộ đề nào.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {myTopics.map(topic => (
                                        <button key={topic.id} onClick={() => setSelectedAsset(topic)} className="group p-5 rounded-[2rem] bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left relative">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                                    <BookOpen size={20}/>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-xs font-black text-white truncate">{topic.name}</p>
                                                    <p className="text-[10px] text-slate-500">{topic.totalKnots || 0} câu hỏi</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )
                        )}
                      </>
                   ) : (
                      <form onSubmit={handleRequestOtp} className="space-y-6 animate-fade-in">
                          {/* Selected Item Preview */}
                          <div className={`p-6 rounded-[2.5rem] flex items-center gap-6 border ${sellTab === 'ITEM' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                             {sellTab === 'ITEM' ? (
                                 <img src={getImageUrl(selectedAsset.item.imageUrl)} className="w-16 h-16 drop-shadow-xl" alt="" />
                             ) : (
                                 <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                                     <BookOpen size={32}/>
                                 </div>
                             )}
                             
                             <div className="flex-1">
                                <h4 className="font-black text-white uppercase italic text-lg line-clamp-1">
                                    {sellTab === 'ITEM' ? selectedAsset.item.name : selectedAsset.name}
                                </h4>
                                <p className={`font-bold text-xs uppercase tracking-widest mt-1 ${sellTab === 'ITEM' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                    {sellTab === 'ITEM' ? `Sở hữu: ${selectedAsset.quantity}` : 'Bộ đề của bạn'}
                                </p>
                                <button type="button" onClick={() => setSelectedAsset(null)} className="text-[10px] font-black text-slate-500 hover:text-white mt-3 uppercase flex items-center gap-1 transition-all">
                                    Chọn lại <ArrowRight size={10}/>
                                </button>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             {sellTab === 'ITEM' && (
                                 <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Số lượng bán</label>
                                    <input type="number" min="1" max={selectedAsset.quantity} value={sellQuantity} onChange={e => setSellQuantity(e.target.value)} className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white font-black text-center text-lg outline-none focus:border-emerald-500" required/>
                                 </div>
                             )}
                             <div className={`space-y-1 ${sellTab === 'TOPIC' ? 'col-span-2' : ''}`}>
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Giá bán (Quan)</label>
                                <input type="number" min="1" value={sellPrice} onChange={e => setSellPrice(e.target.value)} className={`w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-black text-center text-lg outline-none ${sellTab === 'ITEM' ? 'text-emerald-400 focus:border-emerald-500' : 'text-blue-400 focus:border-blue-500'}`} required/>
                             </div>
                          </div>

                          <button type="submit" disabled={isSelling} className={`w-full py-5 text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${sellTab === 'ITEM' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'}`}>
                             {isSelling ? <Loader2 className="animate-spin mx-auto"/> : "NIÊM PHONG & BÁN"}
                          </button>
                      </form>
                   )
                ) : (
                   <form onSubmit={handleConfirmSellWithOtp} className="space-y-8 text-center animate-zoom-in">
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                           <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Xác thực OTP</h3>
                        <p className="text-slate-400 font-medium text-xs">Mã đã gửi về email. Vui lòng kiểm tra.</p>
                      </div>
                      <input type="text" maxLength={6} placeholder="••••••" value={otpCode} onChange={e => setOtpCode(e.target.value)} className="w-full p-6 text-center text-4xl font-black tracking-[0.5em] bg-white/5 rounded-3xl border border-white/10 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700" required />
                      <div className="space-y-3">
                        <button type="submit" disabled={isSelling} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95">XÁC NHẬN BÁN</button>
                        <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors tracking-widest">Quay lại</button>
                      </div>
                   </form>
                )}
             </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes mesh-1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10%, 10%) scale(1.1); } }
        @keyframes mesh-2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-10%, -5%) scale(0.9); } }
        .animate-mesh-1 { animation: mesh-1 20s ease-in-out infinite; }
        .animate-mesh-2 { animation: mesh-2 25s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-zoom-in { animation: zoom-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default Marketplace;