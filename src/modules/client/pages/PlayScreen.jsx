import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Home,
  HelpCircle,
  Trophy,
  Loader2,
  ArrowRight,
  SearchX,
  Check,
  Sparkles,
  Zap,
  Lock, // ✅ Thêm icon Lock
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import httpAxios from "../../../services/httpAxios";
// Đảm bảo đường dẫn này đúng với nơi bạn lưu file Bamboo mới
import Bamboo from "../components/Bamboo";
import Navbar from "../components/Navbar";

// Hook để lấy giá trị trước đó (Safe for render & strict mode)
function usePrevious(value) {
  const [state, setState] = useState({
    value: value,
    prev: null,
  });

  if (state.value !== value) {
    setState({
      value: value,
      prev: state.value,
    });
  }

  return state.prev;
}

// --- 1. CÁC COMPONENT TRANG TRÍ & HIỆU ỨNG (UI Nâng cao) ---

// Hiệu ứng nền chuyển động
const BackgroundEffects = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-300/20 rounded-full blur-[120px] animate-pulse"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-300/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
    <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] bg-yellow-200/20 rounded-full blur-[80px]"></div>
  </div>
);

// Thẻ hiển thị câu hỏi (Glassmorphism)
const QuestionView = ({ question, currentIdx, totalQuestions, onAnswer }) => {
  const optionGradients = [
    "from-blue-500 to-indigo-600 shadow-blue-200/50",
    "from-violet-500 to-purple-600 shadow-purple-200/50",
    "from-amber-500 to-orange-600 shadow-amber-200/50",
    "from-pink-500 to-rose-600 shadow-pink-200/50",
  ];
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="w-full max-w-4xl mx-auto z-10 relative"
    >
      {/* Khung câu hỏi */}
      <div className="bg-white/70 backdrop-blur-[20px] p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white/60 relative overflow-hidden mb-8 group transition-all hover:bg-white/80">
        {/* Thanh tiến độ bên trên */}
        <div className="absolute top-0 left-0 h-2 bg-gray-100/50 w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Header nhỏ: Số câu hỏi */}
        <div className="flex justify-between items-center mb-4 mt-2">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 text-emerald-700 text-sm font-bold uppercase tracking-wider border border-emerald-100 backdrop-blur-md">
            <Zap size={16} className="fill-emerald-500" />
            <span>
              Câu {currentIdx + 1} / {totalQuestions}
            </span>
          </div>
          <div
            className="p-2 bg-white/50 rounded-full hover:bg-white cursor-pointer transition-colors shadow-sm"
            title="Trợ giúp"
          >
            <HelpCircle size={22} className="text-slate-400" />
          </div>
        </div>

        {/* Nội dung câu hỏi */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight text-center my-4">
          {question.content}
        </h2>
      </div>

      {/* Grid đáp án */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {question.options &&
          question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onAnswer(opt)}
              className="group relative p-4 md:p-5 rounded-[2rem] text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] bg-white/60 backdrop-blur-md border border-white/60 hover:border-blue-300/50 shadow-sm flex items-center gap-4 overflow-hidden"
            >
              {/* Icon A, B, C, D */}
              <div
                className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg bg-gradient-to-br ${
                  optionGradients[idx % 4]
                } group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
              >
                {optionLabels[idx]}
              </div>
              {/* Text đáp án */}
              <span className="text-slate-700 font-semibold text-lg group-hover:text-slate-900 transition-colors line-clamp-3 relative z-10">
                {opt}
              </span>
              {/* Hiệu ứng nền khi hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/40 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
      </div>
    </motion.div>
  );
};

// Màn hình Đúng
const CorrectView = ({ onNext, explanation }) => {
  useEffect(() => {
    // Bắn pháo giấy chúc mừng
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ["#22c55e", "#10b981", "#fbbf24"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-4"
    >
      <div className="bg-white/80 backdrop-blur-[30px] p-8 md:p-10 rounded-[3rem] shadow-2xl border border-white/70 w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-2xl animate-pulse"></div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              className="w-28 h-28 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-400/40 relative z-10 border-[6px] border-white/50"
            >
              <Check
                size={56}
                className="text-white drop-shadow-md"
                strokeWidth={4}
              />
            </motion.div>
            <Sparkles
              className="absolute -top-2 -right-2 text-yellow-400 animate-bounce"
              size={32}
            />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-teal-700 mb-2">
            Chính xác!
          </h2>
          <p className="text-slate-500 font-bold text-lg mb-8">
            +1 đốt tre vào hành trình! 🌱
          </p>

          {explanation && (
            <div className="w-full bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-6 mb-8 text-left">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-emerald-600" />
                <span className="text-emerald-800 font-bold uppercase text-xs tracking-wider">
                  Giải thích
                </span>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed">
                {explanation}
              </p>
            </div>
          )}

          <button
            onClick={onNext}
            autoFocus
            className="group w-full md:w-auto min-w-[200px] bg-slate-800 hover:bg-slate-900 text-white py-4 px-10 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <span>Tiếp tục</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Màn hình Sai (Rung lắc + Cảnh báo)
const IncorrectView = ({
  correctAnswer,
  onContinue,
  onGoToTopics,
  isLastQuestion,
  explanation,
}) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    // Hiệu ứng rung lắc nhẹ khi xuất hiện
    transition={{ type: "spring", bounce: 0.5 }}
    className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-4"
  >
    <div className="bg-white/80 backdrop-blur-[30px] p-8 md:p-10 rounded-[3rem] shadow-2xl border border-white/70 w-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-400/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="w-28 h-28 bg-gradient-to-tr from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl shadow-red-400/40 relative z-10 border-[6px] border-white/50">
            <XCircle
              size={56}
              className="text-white drop-shadow-md"
              strokeWidth={4}
            />
          </div>
        </div>

        <h2 className="text-4xl font-black text-slate-800 mb-2">Rất tiếc!</h2>
        <p className="text-red-500 font-bold text-xl mb-6">
          <span className="animate-pulse inline-block">💥</span> Cây tre đã bị
          gãy!
        </p>

        <div className="bg-red-50/80 p-6 rounded-[2rem] border-l-8 border-red-500 w-full mb-8 text-left relative overflow-hidden">
          <p className="text-xs text-red-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
            <CheckCircle size={14} /> Đáp án đúng là
          </p>
          <p className="text-2xl font-black text-slate-800 mb-4">
            {correctAnswer}
          </p>
          {explanation && (
            <div className="pt-4 border-t border-red-200/50">
              <p className="text-slate-700 leading-relaxed font-medium">
                {explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 w-full">
          <button
            onClick={onContinue}
            className="flex-1 min-w-[180px] bg-slate-800 hover:bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            {isLastQuestion ? (
              "Xem kết quả"
            ) : (
              <>
                Câu tiếp theo <ArrowRight size={20} />
              </>
            )}
          </button>
          <button
            onClick={onGoToTopics}
            className="min-w-[140px] bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 py-4 px-6 rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} /> Thoát
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const WinView = ({ onHome }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="text-center flex flex-col items-center max-w-lg mx-auto p-10 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/60"
  >
    <Trophy
      size={120}
      className="text-yellow-400 drop-shadow-2xl mb-6 animate-bounce"
    />
    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-4">
      HOÀN THÀNH!
    </h1>
    <p className="text-slate-600 mb-10 font-bold text-lg">
      Bạn đã chinh phục bộ câu hỏi này. Tuyệt vời!
    </p>
    <button
      onClick={onHome}
      className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-emerald-400/50 hover:-translate-y-1 transition-all"
    >
      <Home size={24} /> Về trang chủ
    </button>
  </motion.div>
);

const EmptyView = ({ topicId, onBack }) => (
  <div className="w-full max-w-lg mx-auto p-6">
    <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <SearchX size={48} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Chưa có dữ liệu
      </h2>
      <p className="text-slate-500 mb-8">
        Chủ đề{" "}
        <span className="font-bold">"{decodeURIComponent(topicId)}"</span>{" "}
        đang được cập nhật.
      </p>
      <button
        onClick={onBack}
        className="flex items-center justify-center gap-2 w-full bg-slate-800 text-white py-4 rounded-xl font-bold transition-all hover:bg-slate-900"
      >
        <ArrowLeft size={20} /> Quay lại
      </button>
    </div>
  </div>
);

// --- ✅ THÊM COMPONENT: Màn hình yêu cầu quyền truy cập (Nếu API trả về 403) ---
const AccessDeniedView = ({ onBack }) => (
    <div className="w-full max-w-lg mx-auto p-6">
        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={48} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Quyền truy cập bị hạn chế
            </h2>
            <p className="text-slate-500 mb-8">
                Chủ đề này là riêng tư. Bạn cần mua nó trên chợ hoặc nhập mã truy cập để vào học.
            </p>
            <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 w-full bg-slate-800 text-white py-4 rounded-xl font-bold transition-all hover:bg-slate-900"
            >
                <ArrowLeft size={20} /> Quay lại
            </button>
        </div>
    </div>
);

// --- 2. MAIN LOGIC (Sửa lỗi ref trong render) ---

const PlayScreen = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  // State quản lý luồng game
  // viewState: LOADING, PLAYING, CORRECT, INCORRECT, WIN, EMPTY, ERROR, DENIED
  const [viewState, setViewState] = useState("LOADING");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // State quản lý điểm số / đốt tre
  const [knots, setKnots] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // SỬ DỤNG CUSTOM HOOK để lấy prevKnots an toàn (tránh lỗi ESLint)
  const prevKnots = usePrevious(knots);

  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [loadingError, setLoadingError] = useState(null);

  // Fetch Data (Đã cập nhật gọi API mới)
  useEffect(() => {
    const fetchData = async () => {
      if (!topicId) return;
      try {
        const client_token = localStorage.getItem("client_token");
        const config = client_token
          ? { headers: { Authorization: `Bearer ${client_token}` } }
          : {};

        // ✅ GỌI API MỚI: play-access để backend check quyền (Mua/Tác giả/Public)
        const qRes = await httpAxios.get(`/game/play-access/${topicId}`, config);

        if (qRes.data && qRes.data.length > 0) {
          setQuestions(qRes.data);
          setViewState("PLAYING");
          setCurrentIdx(0);

          const firstQ = qRes.data[0];
          const tId =
            firstQ.topicId ||
            firstQ.topic_id ||
            (firstQ.topic ? firstQ.topic.id : null);

          if (tId) {
            setCurrentTopicId(tId);
            if (client_token) {
              try {
                const pRes = await httpAxios.get(
                  `/game/progress/${tId}`,
                  config
                );
                const savedKnots = pRes.data.currentKnots || 0;
                setKnots(savedKnots);
                setCompletedCount(pRes.data.currentQuestionIndex || 0);
              } catch (e) {
                console.warn("Lỗi lấy tiến độ:", e);
              }
            }
          }
        } else {
          setViewState("EMPTY");
        }
      } catch (err) {
        console.error("Lỗi tải:", err);
        // ✅ XỬ LÝ LỖI 403: Chưa có quyền
        if (err.response && err.response.status === 403) {
            setViewState("DENIED");
        } else {
            setLoadingError("Không thể kết nối đến máy chủ.");
            setViewState("ERROR");
        }
      }
    };
    fetchData();
  }, [topicId]);

  const handleGoToTopics = useCallback(() => navigate("/profile"), [navigate]);

  const handleNextQuestion = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setViewState("PLAYING");
    } else {
      setViewState("WIN");
    }
  }, [currentIdx, questions.length]);

  // Xử lý trả lời
  const handleAnswer = async (selectedOpt) => {
    const currentQuestion = questions[currentIdx];
    const correctAns =
      currentQuestion.correctAnswer || currentQuestion.correct_answer;
    const isCorrect =
      selectedOpt.trim() === (correctAns ? correctAns.trim() : "");
    const client_token = localStorage.getItem("client_token");

    if (isCorrect) {
      setViewState("CORRECT");
      setKnots((prev) => prev + 1);

      if (client_token && currentTopicId) {
        console.log("🚀 Đang gửi API submit (Correct)...");
        try {
          const res = await httpAxios.post("/game/submit", {
            topicId: currentTopicId,
            correct: true,
          });
          console.log("✅ API Trả về:", res.data);
          if (res.data?.currentKnots !== undefined)
            setKnots(res.data.currentKnots);
          window.dispatchEvent(new Event("userXpUpdated"));
        } catch (e) {
          console.error("❌ Lỗi API:", e);
        }
      }
    } else {
      setViewState("INCORRECT");
      setKnots(0);

      if (client_token && currentTopicId) {
        console.log("🚀 Đang gửi API submit (Incorrect)...");
        try {
          await httpAxios.post("/game/submit", {
            topicId: currentTopicId,
            correct: false,
          });
          window.dispatchEvent(new Event("userXpUpdated"));
        } catch (e) {
          console.error("❌ Lỗi API:", e);
        }
      }
    }
  };

  const getCurrentCorrectAnswer = () => {
    if (!questions || questions.length === 0) return "";
    const q = questions[currentIdx];
    return q.correctAnswer || q.correct_answer;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#ecf0f3] overflow-hidden relative font-sans">
      {/* Nền hiệu ứng */}
      <BackgroundEffects />

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/50">
        <Navbar />
      </div>

      <div className="flex-1 flex flex-row relative mt-[64px] lg:mt-[70px] h-[calc(100vh-64px)] lg:h-[calc(100vh-70px)] z-10">
        {/* Nút thoát */}
        <button
          onClick={handleGoToTopics}
          className="absolute top-6 right-6 z-40 bg-white/80 p-3 rounded-full shadow-lg border border-white text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all group backdrop-blur-md"
        >
          <ArrowLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>

        {/* --- CỘT TRÁI: CÂY TRE (BAMBOO) --- */}
        <div className="hidden lg:block w-[35%] xl:w-[30%] h-full relative border-r border-white/40 bg-white/20 backdrop-blur-lg z-20 shadow-[5px_0_30px_rgba(0,0,0,0.02)]">
          <div className="w-full h-full relative overflow-hidden rounded-tr-[3rem]">
            {/* QUAN TRỌNG: Truyền cả knots và prevKnots xuống */}
            <Bamboo
              knots={knots}
              prevKnots={prevKnots || 0} // Dùng giá trị từ hook an toàn
              totalQuestions={questions.length + completedCount || 10}
            />
          </div>
        </div>

        {/* --- CỘT PHẢI: KHUNG CÂU HỎI --- */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-y-auto z-10 custom-scrollbar">
          <div className="w-full max-w-5xl flex justify-center py-6 min-h-[600px] items-center">
            <AnimatePresence mode="wait">
              {viewState === "LOADING" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="relative">
                    <div
                      className="absolute inset-0 bg-emerald-400/30 rounded-full blur-xl animate-ping"
                      style={{ animationDuration: "3s" }}
                    ></div>
                    <Loader2
                      size={64}
                      className="text-emerald-600 animate-spin relative z-10"
                    />
                  </div>
                  <span className="font-bold text-slate-600 text-xl animate-pulse">
                    Đang tải câu hỏi...
                  </span>
                </motion.div>
              )}

              {/* ✅ CASE MỚI: BỊ TỪ CHỐI (CHƯA MUA) */}
              {viewState === "DENIED" && (
                  <AccessDeniedView onBack={handleGoToTopics} />
              )}

              {viewState === "ERROR" && (
                <div className="text-center p-10 bg-white/80 backdrop-blur-md rounded-[2rem] border border-red-100 shadow-xl">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle size={40} className="text-red-500" />
                  </div>
                  <p className="text-red-500 font-bold mb-6 text-xl">
                    {loadingError}
                  </p>
                  <button
                    onClick={handleGoToTopics}
                    className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition"
                  >
                    Về trang chủ
                  </button>
                </div>
              )}

              {viewState === "PLAYING" && questions.length > 0 && (
                <QuestionView
                  key="question"
                  question={questions[currentIdx]}
                  currentIdx={currentIdx + completedCount}
                  totalQuestions={questions.length + completedCount}
                  onAnswer={handleAnswer}
                />
              )}

              {viewState === "CORRECT" && (
                <CorrectView
                  key="correct"
                  onNext={handleNextQuestion}
                  explanation={questions[currentIdx].explanation}
                />
              )}

              {viewState === "INCORRECT" && (
                <IncorrectView
                  key="incorrect"
                  correctAnswer={getCurrentCorrectAnswer()}
                  explanation={questions[currentIdx].explanation}
                  onContinue={handleNextQuestion}
                  onGoToTopics={handleGoToTopics}
                  isLastQuestion={currentIdx === questions.length - 1}
                />
              )}

              {viewState === "WIN" && (
                <WinView key="win" onHome={handleGoToTopics} />
              )}

              {viewState === "EMPTY" && (
                <EmptyView
                  key="empty"
                  topicId={topicId}
                  onBack={handleGoToTopics}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto py-4 text-center w-full pointer-events-none opacity-40">
            <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
              MinhPhuEdu © 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayScreen;