// components/game/CorrectView.jsx
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

const CorrectView = ({ onNext, explanation }) => {
  useEffect(() => {
    // Hiệu ứng pháo hoa rực rỡ hơn khi hiển thị
    const end = Date.now() + 1000;
    const colors = ['#22c55e', '#16a34a', '#fbbf24', '#ffffff'];
    
    // Bắn pháo hoa từ giữa màn hình
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });

    // Bắn thêm 2 luồng từ 2 bên
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []); // Chỉ chạy 1 lần khi mount

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 animate-fade-in-up">
      {/* Card Container */}
      <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/60 w-full relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon Wrapper */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200 transform hover:scale-105 transition-transform duration-300">
              <Check size={48} className="text-white drop-shadow-md" strokeWidth={4} />
            </div>
            {/* Sparkles decoration */}
            <div className="absolute -top-2 -right-2">
                <Sparkles className="text-yellow-400 animate-bounce" size={24} fill="currentColor" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600 mb-2 text-center">
            Tuyệt vời!
          </h2>
          <p className="text-slate-500 font-medium text-lg mb-8 text-center">
            Tre đang lớn nhanh như thổi...
          </p>

          {/* Explanation Box */}
          {explanation && (
            <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 mb-8 text-left shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-100 p-1.5 rounded-lg">
                    <CheckCircle size={18} className="text-green-600" />
                </div>
                <span className="text-green-800 font-bold uppercase text-sm tracking-wider">Giải thích chi tiết</span>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed font-medium">
                {explanation}
              </p>
            </div>
          )}

          {/* Button Action */}
          <button 
            onClick={onNext}
            className="group relative w-full md:w-auto min-w-[200px] bg-slate-800 hover:bg-slate-900 text-white py-4 px-8 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
          >
            <span className="relative z-10">Câu tiếp theo</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default CorrectView;