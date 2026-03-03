import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle, XCircle, RefreshCcw, Home, ArrowRight } from 'lucide-react';
import Bamboo from '../../../components/Bamboo'; 
import Navbar from '../../../components/Navbar'; 
import httpAxios from '../../../services/httpAxios';

// --- COMPONENT 1: HIỂN THỊ CÂU HỎI (QuestionView) ---
const QuestionView = ({ question, currentIdx, totalQuestions, onAnswer }) => {
  return (
    <div style={{ width: '100%', maxWidth: 800, animation: 'fadeIn 0.5s' }}>
      <div className="bg-white p-10 rounded-3xl shadow-xl mb-8 text-center border-b-4 border-slate-300">
        <h4 className="text-slate-400 uppercase text-sm tracking-widest font-bold mb-4">
           Câu hỏi {currentIdx + 1} / {totalQuestions}
        </h4>
        <h2 className="text-slate-700 text-2xl font-bold leading-relaxed">
           {question.content}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {question.options.map((opt, idx) => (
          <button 
            key={idx} 
            onClick={() => onAnswer(opt)}
            className="p-5 text-lg border-none rounded-2xl cursor-pointer text-white font-bold shadow-[0_5px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[5px] transition-all hover:brightness-110"
            style={{ 
                backgroundColor: ['#e21b3c', '#1368ce', '#d89e00', '#26890c'][idx % 4],
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT 2: KẾT QUẢ ĐÚNG (CorrectView) ---
const CorrectView = ({ onNext }) => {
  useEffect(() => {
    // Bắn pháo hoa nhẹ khi render component này
    confetti({ particleCount: 150, spread: 60, origin: { y: 0.7 }, colors: ['#22c55e', '#ffffff'] });
    
    // Tự động chuyển câu sau 1.5s (hoặc để người dùng bấm nút nếu muốn)
    const timer = setTimeout(onNext, 1500);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="text-center animate-bounce-in flex flex-col items-center justify-center h-full">
      <div className="mb-6 bg-green-100 p-6 rounded-full">
        <CheckCircle size={80} className="text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-green-700 mb-2">Chính xác!</h2>
      <p className="text-slate-500">Măng non đang lớn nhanh như thổi...</p>
    </div>
  );
};

// --- COMPONENT 3: KẾT QUẢ SAI (IncorrectView) ---
const IncorrectView = ({ correctAnswer, onRetry }) => {
  return (
    <div className="text-center animate-shake flex flex-col items-center justify-center h-full w-full max-w-lg">
      <div className="mb-6 bg-red-100 p-6 rounded-full">
        <XCircle size={80} className="text-red-600" />
      </div>
      <h2 className="text-3xl font-bold text-red-600 mb-4">Ôi không! Sai mất rồi</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500 w-full mb-8">
        <p className="text-gray-500 text-sm uppercase font-bold mb-2">Đáp án đúng là:</p>
        <p className="text-xl font-bold text-slate-800">{correctAnswer}</p>
      </div>

      <button 
        onClick={onRetry} // Logic ở đây có thể là chơi lại từ đầu hoặc thử lại câu này (tùy game logic)
        className="flex items-center gap-2 bg-slate-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-800 transition"
      >
        <RefreshCcw size={20} />
        Thử lại ngay
      </button>
    </div>
  );
};

// --- COMPONENT 4: CHIẾN THẮNG (WinView) ---
const WinView = ({ onHome }) => {
  useEffect(() => {
    confetti({ particleCount: 500, spread: 100, startVelocity: 40 }); 
  }, []);

  return (
    <div className="text-center animate-pop-in">
      <div style={{ fontSize: 100, marginBottom: 20 }}>🏆</div>
      <h1 className="text-5xl font-bold text-amber-600 drop-shadow-sm mb-4">KHẮC XUẤT!</h1>
      <p className="text-xl text-green-800 mb-8">Bạn đã hoàn thành xuất sắc chủ đề này.</p>
      <button 
          onClick={onHome} 
          className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto bg-green-700 text-white px-8 py-4 text-xl rounded-full font-bold shadow-green-900/20 shadow-xl hover:bg-green-800 transition"
      >
          <Home size={24} /> Chọn chủ đề khác
      </button>
    </div>
  );
};

// --- COMPONENT CHÍNH: PLAYSCREEN ---
const PlayScreen = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();
  
  // Các trạng thái của màn hình: 'LOADING', 'PLAYING', 'CORRECT', 'INCORRECT', 'WIN', 'ERROR'
  const [viewState, setViewState] = useState('LOADING');
  const [questions, setQuestions] = useState([]); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [knots, setKnots] = useState(0); 
  const [loadingError, setLoadingError] = useState(null);

  // 1. LOAD DATA
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!topicName) return;
      try {
        const decodedTopic = decodeURIComponent(topicName);
        const res = await httpAxios.get(`/game/play?topic=${decodedTopic}`);
        if (res.data && res.data.length > 0) {
          setQuestions(res.data);
          setViewState('PLAYING');
          setKnots(0);
          setCurrentIdx(0);
        } else {
          setLoadingError("Chủ đề này chưa có câu hỏi nào!");
          setViewState('ERROR');
        }
      } catch (err) {
        console.error(err);
        setLoadingError("Lỗi kết nối server!");
        setViewState('ERROR');
      }
    };
    fetchQuestions();
  }, [topicName]);

  // 2. XỬ LÝ TRẢ LỜI
  const handleAnswer = (selectedOpt) => {
    const currentQ = questions[currentIdx];
    
    if (selectedOpt === currentQ.correctAnswer) {
      // Logic khi ĐÚNG
      setKnots(prev => prev + 1);
      setViewState('CORRECT'); // Chuyển sang màn hình CorrectView
    } else {
      // Logic khi SAI
      setViewState('INCORRECT'); // Chuyển sang màn hình IncorrectView
    }
  };

  // 3. XỬ LÝ CHUYỂN TIẾP SAU KHI ĐÚNG
  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setViewState('PLAYING'); // Quay lại màn hình hỏi câu tiếp theo
    } else {
      setViewState('WIN'); // Hết câu hỏi -> Win
    }
  };

  // 4. XỬ LÝ KHI SAI (VÍ DỤ: CHƠI LẠI TỪ ĐẦU HOẶC THOÁT)
  const handleRetryGame = () => {
      // Logic game Thánh Gióng: Sai là gãy tre -> Reset về 0 hoặc Về trang chọn chủ đề
      // Ở đây tôi chọn reset câu hiện tại hoặc Về trang chọn chủ đề tùy bạn
      navigate('/app'); 
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f0fdf4]">
      <Navbar />

      <div style={{ flex: 1, display: 'flex', position: 'relative', marginTop: '80px' }}>
        
        {/* NÚT BACK */}
        <button 
          onClick={() => navigate('/app')}
          className="absolute top-5 right-5 z-50 bg-white w-12 h-12 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
          title="Thoát"
        >
          <ArrowLeft size={24} />
        </button>

        {/* CỘT TRÁI: CÂY TRE (Giữ nguyên để hiển thị progress) */}
        <div style={{ width: '30%', background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)', borderRight: '5px solid #8B4513', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <div style={{ position: 'absolute', top: 20, fontSize: 60 }}>☁️</div>
          <div style={{ paddingBottom: 40, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '100%' }}>
               <Bamboo knots={knots} />
          </div>
          <div style={{ width: '100%', height: 40, background: '#4caf50', position: 'absolute', bottom: 0 }}></div>
        </div>

        {/* CỘT PHẢI: SWITCH CÁC COMPONENT THEO TRẠNG THÁI */}
        <div style={{ width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
          
          {viewState === 'LOADING' && (
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-700 animate-pulse">Đang tải bộ câu hỏi...</h2>
              </div>
          )}

          {viewState === 'ERROR' && (
              <div className="text-center">
                  <div style={{ fontSize: 60, marginBottom: 10 }}>⚠️</div>
                  <h2 className="text-2xl font-bold text-red-600 mb-4">{loadingError}</h2>
                  <button onClick={() => navigate('/app')} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                      Quay lại
                  </button>
              </div>
          )}

          {/* RENDER CÁC VIEW CON TÙY THEO STATE */}
          {viewState === 'PLAYING' && questions.length > 0 && (
            <QuestionView 
                question={questions[currentIdx]} 
                currentIdx={currentIdx}
                totalQuestions={questions.length}
                onAnswer={handleAnswer} 
            />
          )}

          {viewState === 'CORRECT' && (
            <CorrectView onNext={handleNextQuestion} />
          )}

          {viewState === 'INCORRECT' && questions.length > 0 && (
            <IncorrectView 
                correctAnswer={questions[currentIdx].correctAnswer} 
                onRetry={handleRetryGame}
            />
          )}

          {viewState === 'WIN' && (
            <WinView onHome={() => navigate('/app')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayScreen;