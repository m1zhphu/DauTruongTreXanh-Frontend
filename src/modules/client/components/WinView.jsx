// components/game/WinView.jsx
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Home } from 'lucide-react';

const WinView = ({ onHome }) => {
  useEffect(() => {
    // Pháo hoa lớn
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const random = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center animate-pop-in flex flex-col items-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-30 rounded-full animate-pulse"></div>
        <Trophy size={100} className="text-yellow-500 relative z-10 drop-shadow-lg" />
      </div>
      
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-4" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
        KHẮC XUẤT!
      </h1>
      
      <p className="text-xl text-slate-600 mb-10 max-w-md">
        Bạn đã hoàn thành xuất sắc chủ đề này. Tre đã vươn tới trời xanh!
      </p>

      <button 
          onClick={onHome} 
          className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-green-500/30 hover:scale-105 transition-transform"
      >
          <Home size={24} />
          Chọn chủ đề khác
      </button>
    </div>
  );
};

export default WinView;