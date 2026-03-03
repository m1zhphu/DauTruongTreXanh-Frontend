import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Shuffle, User } from "lucide-react";

// Sử dụng style 'adventurer' của DiceBear (Rất hợp game 2D)
const AVATAR_STYLE = "adventurer"; 

const AvatarCreator = ({ onAvatarChange }) => {
  // Các thuộc tính có thể chỉnh (Seed)
  //const [seed, setSeed] = useState(Math.random().toString(36).substring(7));
  const [seed, setSeed] = useState(() => Math.random().toString(36).substring(7));
  // Tạo URL avatar từ seed
  // Bạn có thể tham khảo thêm document của DiceBear để thêm options (màu tóc, kính, v.v.)
  const avatarUrl = `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  // Gửi URL ra ngoài mỗi khi seed thay đổi
  useEffect(() => {
    onAvatarChange(avatarUrl);
  }, [seed,avatarUrl, onAvatarChange]);

  const handleRandomize = (e) => {
    e.preventDefault(); // Chặn submit form nếu nằm trong form
    setSeed(Math.random().toString(36).substring(7));
  };

  return (
    <div className="flex flex-col items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm w-full max-w-xs mx-auto">
      <div className="relative group">
        {/* Khung hiển thị Avatar */}
        <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 relative">
            <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover"
            />
        </div>
        
        {/* Nút Random nhanh */}
        <button 
            onClick={handleRandomize}
            className="absolute bottom-2 right-0 bg-slate-900 text-white p-2 rounded-full shadow-md hover:scale-110 transition active:scale-95"
            title="Đổi nhân vật ngẫu nhiên"
            type="button"
        >
            <Shuffle size={16} />
        </button>
      </div>

      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Tạo nhân vật của bạn</p>
      
      {/* Các nút điều chỉnh (Giả lập chọn qua lại) */}
      <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
         <button type="button" onClick={handleRandomize} className="hover:text-purple-600 transition"><ChevronLeft/></button>
         <span className="font-bold text-sm min-w-[80px] text-center select-none">Ngẫu nhiên</span>
         <button type="button" onClick={handleRandomize} className="hover:text-purple-600 transition"><ChevronRight/></button>
      </div>
    </div>
  );
};

export default AvatarCreator;