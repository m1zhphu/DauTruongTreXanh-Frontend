import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LogOut, Edit3, Zap, Flame, Trophy, 
  MapPin, Calendar, Mail, Gamepad2, Coins, 
  TrendingUp, Activity, ChevronRight, Award, Share2,
  Package, ShoppingBag, BookOpen, DollarSign, Play 
} from 'lucide-react';
import httpAxios from '../../../services/httpAxios';
import API_BASE_URL from '../../../services/apiConfig'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]); 
  const [myTopics, setMyTopics] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [imageVersion, setImageVersion] = useState(Date.now()); 
  const navigate = useNavigate();

  // === Logic Logout ===
  const handleLogout = useCallback(() => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_user');
    window.dispatchEvent(new Event("clientLogout"));
    navigate('/login');
  }, [navigate]);

  // === Fetch Data ===
  const fetchData = useCallback(async () => {
    try {
        // 1. User Info
        const userRes = await httpAxios.get(`/users/me?t=${new Date().getTime()}`);
        setUser(userRes.data);
        localStorage.setItem('client_user', JSON.stringify(userRes.data));

        // 2. Inventory Info
        const invRes = await httpAxios.get(`/gacha/inventory`);
        setInventory(invRes.data);

        // 3. ✅ QUAN TRỌNG: Gọi API /my-library để lấy danh sách phân loại
        const libraryRes = await httpAxios.get(`/questions/my-library`);
        
        // Gộp 2 danh sách lại và gắn nhãn loại (type)
        const allTopics = [
            // Những bài mình tạo -> Type: CREATED
            ...libraryRes.data.created.map(t => ({...t, type: 'CREATED'})),
            // Những bài mình mua -> Type: PURCHASED
            ...libraryRes.data.purchased.map(t => ({...t, type: 'PURCHASED'}))
        ];
        
        setMyTopics(allTopics);

        setImageVersion(Date.now()); 
        setTimeout(() => setLoading(false), 500);
    } catch (err) {
        if (err.response?.status === 401) handleLogout();
        setLoading(false); 
    }
  }, [handleLogout]);

  useEffect(() => {
    fetchData();
    const handleUserUpdate = () => fetchData();
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, [fetchData]);

  const getFullImageUrl = (url) => {
    if (!url || url === "default_avatar.png") return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if (url.startsWith("http")) return url;
    const backendRoot = API_BASE_URL.replace(/\/api\/?$/, ""); 
    return `${backendRoot}${url}?v=${imageVersion}`;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
        case 'LEGENDARY': return 'border-amber-400 bg-amber-50/50 shadow-amber-100';
        case 'RARE': return 'border-blue-400 bg-blue-50/50 shadow-blue-100';
        default: return 'border-slate-200 bg-slate-50/50 shadow-slate-100';
    }
  };

  const fadeIn = { animation: "fadeIn 0.6s ease-out" };
  const floatAnim = { animation: "float 6s ease-in-out infinite" };

  // --- Hàm xử lý bán Topic (Chỉ dành cho topic mình tạo) ---
  const handleSellTopic = (topicId) => {
      navigate(`/market-place?action=sell&type=TOPIC&id=${topicId}`);
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#F3F4F6] flex flex-col items-center justify-center gap-4">
       <div className="relative">
         <div className="w-16 h-16 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
       </div>
       <p className="text-slate-500 font-medium tracking-wide animate-pulse">Đang đồng bộ dữ liệu...</p>
    </div>
  );

  if (!user) return null;

  const currentLevel = Math.floor((user.totalXp || 0) / 1000) + 1;
  const xpForNextLevel = 1000;
  const currentLevelXp = (user.totalXp || 0) % 1000;
  const progressPercent = Math.min((currentLevelXp / xpForNextLevel) * 100, 100);
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : "N/A";

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-800 font-sans overflow-x-hidden relative selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[100px]" style={floatAnim}></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-amber-200/30 rounded-full blur-[100px]" style={{...floatAnim, animationDelay: "2s"}}></div>
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-blue-200/30 rounded-full blur-[80px]" style={{...floatAnim, animationDelay: "4s"}}></div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes shine { 100% { left: 125%; } }
        .shine-effect { position: relative; overflow: hidden; }
        .shine-effect::after { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent); transform: skewX(-25deg); animation: shine 3s infinite; }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-10">
        
        {/* HEADER NAV */}
        <header className="flex justify-between items-center mb-8" style={fadeIn}>
            <button onClick={() => navigate('/')} className="flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white hover:shadow-md hover:scale-105 transition-all group text-slate-600">
                <div className="bg-slate-100 p-1.5 rounded-full group-hover:bg-slate-200 transition-colors"><ArrowLeft size={18} /></div>
                <span className="font-bold">Trang chủ</span>
            </button>
            <div className="flex gap-3">
                <button className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white hover:text-indigo-600 hover:shadow-md transition-all">
                    <Share2 size={20} />
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white text-red-500 hover:bg-red-50 hover:shadow-md transition-all font-bold">
                    <LogOut size={18} /> <span className="hidden sm:inline">Đăng xuất</span>
                </button>
            </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === COL 1: IDENTITY CARD (Left) === */}
            <div className="lg:col-span-1 space-y-6" style={{...fadeIn, animationDelay: "0.1s"}}>
                {/* Profile Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-[2.5rem]">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    </div>

                    <div className="relative flex flex-col items-center mt-10">
                        <div className="relative group">
                            <div className="w-36 h-36 rounded-full p-1.5 bg-white shadow-2xl ring-4 ring-white/50">
                                <img src={getFullImageUrl(user.avatarUrl)} alt="User" className="w-full h-full object-cover rounded-full bg-slate-100" onError={(e) => {e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}} />
                            </div>
                            <button onClick={() => navigate('/profile/edit')} className="absolute bottom-1 right-1 p-3 bg-slate-900 text-white rounded-full shadow-lg border-2 border-white hover:bg-emerald-500 hover:scale-110 transition-all active:scale-95">
                                <Edit3 size={16} />
                            </button>
                        </div>

                        <div className="text-center mt-5">
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h1>
                            <p className="text-slate-500 font-medium text-sm flex items-center justify-center gap-1 mt-1">
                                <span className="text-emerald-500">@</span>{user.username}
                            </p>
                        </div>

                        <div className="flex w-full justify-between mt-8 px-2">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Cấp độ</p>
                                <p className="text-xl font-black text-slate-800">{currentLevel}</p>
                            </div>
                            <div className="w-[1px] bg-slate-200 h-8 mt-2"></div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Rank</p>
                                <p className="text-xl font-black text-slate-800">Đồng</p>
                            </div>
                            <div className="w-[1px] bg-slate-200 h-8 mt-2"></div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">ID</p>
                                <p className="text-xl font-black text-slate-800">#{user.id}</p>
                            </div>
                        </div>

                        <div className="w-full bg-white/60 rounded-2xl p-4 mt-8 space-y-3 border border-white">
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><Mail size={16}/></div>
                                <span className="truncate">{user.email || "Chưa cập nhật"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Calendar size={16}/></div>
                                <span>Tham gia: {joinDate}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <div className="p-2 bg-teal-50 text-teal-500 rounded-lg"><MapPin size={16}/></div>
                                <span>Việt Nam</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={() => navigate('/my-quizzes')} className="shine-effect w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl shadow-xl shadow-slate-300 transition-all active:scale-[0.98] flex items-center justify-between px-8 group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl"><Gamepad2 size={24} /></div>
                        <div className="text-left">
                            <p className="font-bold text-lg">Quiz Của Tôi</p>
                            <p className="text-xs text-slate-400">Xem lịch sử & thành tích</p>
                        </div>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full group-hover:bg-white group-hover:text-slate-900 transition-colors"><ChevronRight size={20} /></div>
                </button>
            </div>

            {/* === COL 2 & 3: STATS, INVENTORY & TOPICS (Right) === */}
            <div className="lg:col-span-2 space-y-6" style={{...fadeIn, animationDelay: "0.2s"}}>
                
                {/* 1. STATS ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Rice (Tài sản) */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-amber-100/50 border border-white hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.08]"><Coins size={80} /></div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Coins size={20} fill="currentColor" /></div>
                                <span className="text-xs font-bold text-slate-400 uppercase">Tài sản</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-800">{user.rice?.toLocaleString() || 0}</h3>
                                <p className="text-xs font-bold text-amber-500 mt-1 flex items-center gap-1"><TrendingUp size={12}/> Lúa</p>
                            </div>
                        </div>
                    </div>
                    {/* XP */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-indigo-100/50 border border-white hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.08]"><Zap size={80} /></div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Zap size={20} fill="currentColor" /></div>
                                <span className="text-xs font-bold text-slate-400 uppercase">Tổng XP</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-800">{user.totalXp?.toLocaleString() || 0}</h3>
                                <p className="text-xs font-bold text-indigo-500 mt-1">Cấp tiếp theo: {xpForNextLevel - currentLevelXp} XP</p>
                            </div>
                        </div>
                    </div>
                    {/* Streak */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-lg shadow-rose-100/50 border border-white hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.08]"><Flame size={80} /></div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><Flame size={20} fill="currentColor" /></div>
                                <span className="text-xs font-bold text-slate-400 uppercase">Chuỗi ngày</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-800">{user.currentStreak || 0}</h3>
                                <p className="text-xs font-bold text-rose-500 mt-1">Giữ lửa đam mê!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PROGRESS BAR */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg"><Trophy size={24} className="text-yellow-300" fill="currentColor"/></div>
                                <h2 className="text-3xl font-black tracking-tight">Cấp độ {currentLevel}</h2>
                            </div>
                            <p className="text-emerald-100 font-medium max-w-md">Bạn đang làm rất tốt! Hãy hoàn thành thêm bài học để mở khóa danh hiệu mới.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black">{currentLevelXp} <span className="text-lg font-medium text-emerald-200">/ {xpForNextLevel} XP</span></p>
                        </div>
                    </div>
                    <div className="mt-6 h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm p-1">
                        <div className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-lg transition-all duration-1000 ease-out relative" style={{ width: `${progressPercent}%` }}>
                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                        </div>
                    </div>
                </div>

                {/* ✅ 3. MY TOPICS SECTION (Thư viện: Tạo & Mua) */}
                <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-blue-100/50 border border-white">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <BookOpen size={24} className="text-blue-500" /> 
                            Thư viện chủ đề
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{myTopics.length} bộ</span>
                        </h3>
                        <button onClick={() => navigate('/create-topic')} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            + Tạo mới
                        </button>
                    </div>

                    {myTopics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                            <p className="text-slate-400 text-sm mb-2">Thư viện trống.</p>
                            <button onClick={() => navigate('/create-topic')} className="text-blue-600 font-bold hover:underline">Tạo ngay</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myTopics.map((topic) => (
                                <div key={topic.id} className={`group relative border rounded-2xl p-4 hover:shadow-lg transition-all flex flex-col justify-between ${topic.type === 'PURCHASED' ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-200'}`}>
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800 line-clamp-1">{topic.name}</h4>
                                            
                                            {/* HIỂN THỊ NHÃN */}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                topic.type === 'PURCHASED' ? 'bg-purple-200 text-purple-800' : 
                                                (topic.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')
                                            }`}>
                                                {topic.type === 'PURCHASED' ? 'Đã mua' : (topic.isPublic ? 'Công khai' : 'Riêng tư')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{topic.description || "Chưa có mô tả"}</p>
                                        <p className="text-xs text-slate-400 font-medium">{topic.totalKnots || 0} câu hỏi</p>
                                    </div>
                                    
                                    {/* PHÂN CHIA NÚT BẤM */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                                        
                                        {/* CASE 1: ĐÃ MUA -> CHỈ HIỆN NÚT VÀO HỌC (Full width) */}
                                        {topic.type === 'PURCHASED' ? (
                                            <button 
                                                // ✅ Điều hướng đúng đến trang PlayScreen
                                                onClick={() => navigate(`/game/${topic.id}`)}
                                                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-purple-700 shadow-md shadow-purple-200 transition-all hover:-translate-y-0.5"
                                            >
                                                <Play size={16} fill="currentColor"/> Vào học ngay
                                            </button>
                                        ) : (
                                        /* CASE 2: TỰ TẠO -> HIỆN NÚT BÁN VÀ SỬA */
                                            <>
                                                <button 
                                                    onClick={() => handleSellTopic(topic.id)}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold py-2 rounded-xl hover:bg-amber-200 transition-colors"
                                                >
                                                    <DollarSign size={14}/> Bán
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/topic/edit/${topic.id}`)}
                                                    className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                                                >
                                                    <Edit3 size={16}/>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. INVENTORY SECTION (Túi đồ) */}
                <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-white">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Package size={24} className="text-indigo-500" /> 
                            Túi Đồ
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{inventory.length} vật phẩm</span>
                        </h3>
                        <button onClick={() => navigate('/gacha')} className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            Gacha Shop <ChevronRight size={16}/>
                        </button>
                    </div>

                    {inventory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-300"><ShoppingBag size={32} /></div>
                            <p className="text-slate-600 font-bold">Túi đồ trống rỗng</p>
                            <p className="text-slate-400 text-sm mb-4">Hãy tham gia Gacha để nhận vật phẩm hiếm!</p>
                            <button onClick={() => navigate('/gacha')} className="px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-all shadow-lg">Quay Gacha Ngay</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {inventory.map((slot) => {
                                const item = slot.item;
                                if (!item) return null; 
                                const borderColor = getRarityColor(item.rarity);
                                return (
                                    <div key={slot.id} className={`group relative bg-white border-2 ${borderColor} rounded-2xl aspect-square flex flex-col items-center justify-center p-2 cursor-pointer hover:scale-105 transition-transform duration-300`}>
                                        <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm z-10">x{slot.quantity}</div>
                                        <img 
                                            src={getFullImageUrl(item.imageUrl)} 
                                            alt={item.name} 
                                            className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {e.target.src="https://cdn-icons-png.flaticon.com/512/679/679720.png"}}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-white via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end rounded-b-xl">
                                            <p className="text-[10px] font-bold text-slate-800 text-center line-clamp-1">{item.name}</p>
                                            <p className={`text-[8px] font-bold uppercase tracking-wide ${item.rarity === 'LEGENDARY' ? 'text-amber-500' : item.rarity === 'RARE' ? 'text-blue-500' : 'text-slate-400'}`}>{item.rarity}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;