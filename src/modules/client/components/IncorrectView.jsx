// components/game/IncorrectView.jsx
import React from 'react';
import { X, AlertTriangle, ArrowLeft } from 'lucide-react';

const IncorrectView = ({ correctAnswer, onContinue, explanation }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg animate-shake">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-200">
        <X size={48} className="text-red-600" strokeWidth={4} />
      </div>

      <h2 className="text-3xl font-extrabold text-red-600 mb-2">Tre đã gãy mất rồi!</h2>
      <p className="text-slate-500 mb-8 text-center">Rất tiếc, câu trả lời chưa chính xác.</p>

      {/* Hiển thị đáp án đúng */}
      <div className="w-full bg-white border-l-8 border-red-500 rounded-xl p-6 shadow-md mb-8">
        <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-sm mb-2">
            <AlertTriangle size={16} />
            Đáp án đúng là:
        </div>
        <div className="text-xl font-bold text-slate-800">
            {correctAnswer}
        </div>
      </div>
      {/* --- THÊM PHẦN GIẢI THÍCH --- */}
        <div className="pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-bold mb-1">💡 Vì sao lại thế?</p>
            <p className="text-slate-700">{explanation}</p>
        </div>
        {/* --------------------------- */}

      <button 
        onClick={onContinue}
        className="flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
      >
        <ArrowLeft size={20} />
        Quay về ôn luyện thêm
      </button>
    </div>
  );
};

export default IncorrectView;