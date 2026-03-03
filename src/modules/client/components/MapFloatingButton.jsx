import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Gamepad2 } from 'lucide-react'; // Import thêm icon Gamepad2

const FloatingActionButtons = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Danh sách các trang KHÔNG hiển thị các nút này
  const hiddenPaths = [
    '/login', 
    '/register', 
    '/admin',       
    '/vietnam-map', // Ẩn khi đang ở map
    '/quiz',        // Ẩn khi đang ở trang quiz/join
    '/live-battle'  
  ];

  // Kiểm tra xem đường dẫn hiện tại có nằm trong danh sách ẩn không
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    // Container định vị cố định, xếp các nút theo chiều dọc
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* --- NÚT 1: THAM GIA QUIZ (Màu Tím) --- */}
      <button
        onClick={() => navigate('/quiz/join')}
        className="group flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-3 rounded-full shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-110 transition-all duration-300 border-2 border-white"
        title="Tham gia Quiz"
      >
        <Gamepad2 size={24} className="group-hover:rotate-12 transition-transform" />
        
        {/* Chữ trượt ra khi hover */}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap font-bold text-sm">
          Vào chơi Quiz
        </span>
      </button>

      {/* --- NÚT 2: BẢN ĐỒ (Màu Đỏ - Giữ nguyên nhưng bỏ fixed vì đã có div cha) --- */}
      <button
        onClick={() => navigate('/vietnam-map')}
        className="group flex items-center justify-center bg-gradient-to-r from-red-600 to-yellow-500 text-white p-3 rounded-full shadow-lg shadow-red-500/40 hover:shadow-red-500/60 hover:scale-110 transition-all duration-300 border-2 border-white"
        title="Hành Trình Xuyên Việt"
      >
        <MapPin size={24} className="animate-bounce" />
        
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap font-bold text-sm">
          Thử Thách Xuyên Việt
        </span>
      </button>

    </div>
  );
};

export default FloatingActionButtons;