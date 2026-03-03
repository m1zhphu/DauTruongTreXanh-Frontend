import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // 1. Thêm useSearchParams
import { ArrowRight, Hash, User, Gamepad2, ArrowLeft } from "lucide-react";
import AvatarCreator from "../components/AvatarCreator";

const QuizJoin = () => {
  const navigate = useNavigate();
  
  // 2. Logic lấy mã PIN từ URL (nếu có)
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get("code"); // Lấy giá trị ?code=...

  // Nếu có code trên URL thì điền luôn, nếu không thì để trống
  const [pin, setPin] = useState(codeFromUrl || ""); 
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    if (!pin || !username) return alert("Vui lòng nhập đầy đủ thông tin!");
    
    navigate(`/quiz/${pin}`, { 
        state: { 
            username, 
            avatar, 
            isHost: false 
        } 
    });
  };

  return (
    // FIX 1: Thay min-h-screen thành min-h-[100dvh] để fix lỗi thanh địa chỉ trên mobile
    // Thêm overflow-y-auto để cho phép cuộn nếu màn hình quá nhỏ
    <div className="min-h-[100dvh] w-full bg-[#FAFAFA] text-slate-800 font-sans relative flex flex-col items-center overflow-y-auto">
      
      {/* --- BACKGROUND GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(to right, #e5e7eb 1px, transparent 1px)`,
             backgroundSize: '48px 48px',
             opacity: 0.6
           }}>
      </div>

      {/* --- BACK BUTTON --- */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <div className="p-2 bg-white rounded-full border border-slate-200 shadow-sm group-hover:border-slate-300 transition-all">
            <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:inline">Quay lại</span>
      </button>

      {/* FIX 2: Container chính 
          - Bỏ justify-center tuyệt đối để tránh bị cắt đầu/đuôi khi nội dung dài.
          - Dùng py-10 (hoặc py-20) và my-auto để căn giữa nhưng vẫn cho phép cuộn.
      */}
      <div className="z-10 w-full max-w-md px-4 py-12 my-auto flex flex-col justify-center">
        
        {/* --- MAIN CARD --- */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
          
          {/* Header */}
          <div className="bg-slate-900 p-5 sm:p-6 text-center relative overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center gap-2 text-white">
                      <Gamepad2 size={24} className="sm:w-7 sm:h-7" />
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight">THAM GIA</h1>
                  </div>
                  <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Tạo nhân vật & Nhập PIN</p>
              </div>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className="p-5 sm:p-6 space-y-5 sm:space-y-6">
            
            {/* 1. Avatar */}
            <div className="flex justify-center -mt-2">
               <AvatarCreator onAvatarChange={setAvatar} />
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* 2. PIN Input */}
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Hash size={12} /> Game PIN
                  </label>
                  <input 
                    type="text" 
                    inputMode="numeric" // FIX 3: Hiện bàn phím số trên điện thoại
                    className="w-full text-center text-2xl sm:text-3xl font-black tracking-widest py-2 sm:py-3 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:ring-4 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-200 uppercase text-slate-800"
                    placeholder="000 000"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={6}
                    // Nếu đã có mã code từ URL thì disable ô nhập để người dùng đỡ sửa nhầm (tùy chọn)
                    // disabled={!!codeFromUrl} 
                  />
              </div>

              {/* 3. Username Input */}
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <User size={12} /> Biệt danh
                  </label>
                  <input 
                    type="text" 
                    className="w-full text-center text-lg sm:text-xl font-bold py-2 sm:py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-50 outline-none transition-all placeholder:text-slate-300 text-slate-800"
                    placeholder="Tên hiển thị..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus={!!codeFromUrl} // Tự động focus vào ô nhập tên nếu mã PIN đã có
                  />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white font-bold text-lg py-3 sm:py-4 rounded-xl shadow-lg shadow-slate-200 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
            >
              VÀO GAME <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-slate-400 text-xs font-medium uppercase tracking-widest text-center">
          Powered by Quiz Arena
        </p>
      </div>

    </div>
  );
};

export default QuizJoin;