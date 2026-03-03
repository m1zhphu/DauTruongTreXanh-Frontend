import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, CheckCircle, XCircle, Trophy, Home, Volume2, VolumeX, Crown, Eye } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"; // FIX: Dùng motion chữ thường
import confetti from "canvas-confetti";

(function () {
  if (typeof window !== "undefined" && !window.global) window.global = window;
})();

import httpAxios from '../../../services/httpAxios';

const BASE_URL = httpAxios.defaults.baseURL?.replace('/api', '') || "http://localhost:8080";
const WS_URL = `${BASE_URL}/ws-game`;

const Leaderboard = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-md rounded-2xl p-4 mt-6 border border-white/10 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <h3 className="text-center text-yellow-400 font-bold uppercase tracking-widest mb-4 text-xs flex items-center justify-center gap-2">
        <Crown size={14} /> Bảng Phong Thần
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {data.map((user, index) => (
          <div key={index} className={`flex items-center justify-between p-2.5 rounded-xl border ${index === 0 ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                index === 0 ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/50' : 
                index === 1 ? 'bg-slate-300 text-black' : 
                index === 2 ? 'bg-orange-400 text-white' : 'bg-slate-700 text-gray-300'
              }`}>
                {index + 1}
              </div>
              <span className={`font-bold text-sm truncate max-w-[150px] ${index === 0 ? 'text-yellow-200' : 'text-white'}`}>
                {user.name || user.username || "Ẩn danh"}
              </span>
            </div>
            <span className="font-mono text-emerald-400 font-bold text-sm">
              {user.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LiveBattle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invalidId = id === ":id" || !id || Number.isNaN(Number(id));

  const [gameState, setGameState] = useState(invalidId ? "ERROR_ID" : "WAITING");
  const [waitingMsg, setWaitingMsg] = useState("Đang chờ quan giám khảo phát đề...");
  
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]); 
  const [winner, setWinner] = useState(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const [isEliminated, setIsEliminated] = useState(false); 
  const [isSpectator, setIsSpectator] = useState(false);
  
  const eliminatedRef = useRef(false);
  const stompClientRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const lastQuestionKeyRef = useRef("");

  const token = useMemo(() => localStorage.getItem("client_token") || localStorage.getItem("admin_token") || localStorage.getItem("token") || "", []);
  const role = useMemo(() => {
    const safeParse = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
    if (localStorage.getItem("client_token")) { const c = safeParse("client_user"); if (c?.role) return c.role; }
    if (localStorage.getItem("admin_token")) { const a = safeParse("admin_user"); if (a?.role) return a.role; }
    return "GUEST";
  }, []);
  
  const canAnswer = !!token && (role === "ROLE_USER" || role === "ROLE_ADMIN") && !isEliminated && !isSpectator;

  const startLocalTimer = useCallback((seconds) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimer(seconds);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(timerIntervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (invalidId) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    eliminatedRef.current = false;
    setIsEliminated(false);
    setIsSpectator(false);
    setGameState("WAITING");
    setWaitingMsg("Đang chờ quan giám khảo phát đề...");
    setQuestion(null);
    setTimer(0);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setParticipants(0);
    setLeaderboard([]);
    setWinner(null);
    lastQuestionKeyRef.current = "";
  }, [id, invalidId]);

  const handleServerMessage = useCallback((msg) => {
      console.log("📩 Server msg:", msg);

      if (msg.type === "PARTICIPANT_UPDATE") setParticipants(msg.count ?? 0);

      if (eliminatedRef.current && !isSpectator) {
         if (msg.type === "GAME_OVER") {
             // Pass through
         } else if (msg.type !== "ELIMINATED") {
             return; 
         }
      }

      switch (msg.type) {
        case "START_GAME":
          setGameState("PLAYING");
          setWaitingMsg("");
          break;

        case "NEW_QUESTION": {
          const key = `${msg.round}|${msg.content}`;
          if (lastQuestionKeyRef.current === key) return;
          lastQuestionKeyRef.current = key;

          setGameState("PLAYING");
          setQuestion({
            content: msg.content,
            options: Array.isArray(msg.options) ? msg.options : [],
            round: msg.round,
            timeLeft: msg.timeLeft ?? 15,
          });
          setCorrectAnswer(null);
          setSelectedAnswer(null);
          startLocalTimer(msg.timeLeft || 15);
          break;
        }

        case "ROUND_RESULT":
          setGameState("RESULT");
          setCorrectAnswer(msg.correctAnswer);
          if (msg.survivors !== undefined) setParticipants(msg.survivors);
          if (msg.leaderboard) setLeaderboard(msg.leaderboard);
          break;

        case "ELIMINATED":
          eliminatedRef.current = true;
          setIsEliminated(true);
          setGameState("ELIMINATED_SCREEN");
          setWaitingMsg(msg.message || "Bạn đã bị loại!"); 
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setTimer(0);
          break;

        case "GAME_OVER":
          setGameState("WINNER");
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
          if (msg.winner) setWinner(msg.winner);
          if (msg.leaderboard) setLeaderboard(msg.leaderboard);
          break;

        case "WAITING":
          setGameState("WAITING");
          setWaitingMsg(msg.message || "Đang chờ admin bắt đầu...");
          break;

        case "ERROR":
          alert("Lỗi: " + msg.message);
          break;
        default: break;
      }
    }, [startLocalTimer, isSpectator]);

  useEffect(() => {
    if (invalidId) return;
    let cancelled = false;
    const connectSocket = async () => {
      try {
        if (stompClientRef.current?.connected) stompClientRef.current.disconnect();
        
        const SockJS = (await import("sockjs-client")).default;
        const Stomp = (await import("stompjs")).default || (await import("stompjs"));
        
        const socket = new SockJS(`${WS_URL}?token=${encodeURIComponent(token || "")}`);
        const client = Stomp.over(socket);
        client.debug = null;
        
        client.connect({}, () => {
            if (cancelled) return;
            setIsConnected(true);
            client.subscribe(`/topic/event/${id}`, (m) => handleServerMessage(JSON.parse(m.body)));
            client.subscribe(`/user/queue/messages`, (m) => handleServerMessage(JSON.parse(m.body)));
            client.send(`/app/event/${id}/join`, {}, JSON.stringify({}));
          },
          () => { // FIX: Bỏ biến err
            if (cancelled) return;
            setIsConnected(false);
            if (!eliminatedRef.current) setGameState("WAITING");
          }
        );
        stompClientRef.current = client;
      } catch { // FIX: Bỏ biến err
        setIsConnected(false); 
      }
    };
    connectSocket();
    return () => {
      cancelled = true;
      try { if (stompClientRef.current) stompClientRef.current.disconnect(); } catch (e) { console.log(e); }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsConnected(false);
    };
  }, [id, invalidId, handleServerMessage, token]);

  const handleSelectAnswer = (ans) => {
    if (!canAnswer || gameState !== "PLAYING" || selectedAnswer !== null) return;
    setSelectedAnswer(ans);
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(`/app/event/${id}/answer`, {}, JSON.stringify({ answer: ans }));
    }
  };

  const handleContinueWatching = () => {
      setIsSpectator(true);
      if (question) {
          setGameState(correctAnswer ? "RESULT" : "PLAYING");
      } else {
          setGameState("WAITING");
      }
  };

  const getOptionStyle = (opt) => {
    if (gameState === "RESULT" && correctAnswer) {
      if (opt === correctAnswer) 
        return "bg-green-500 text-white border-green-600 shadow-xl scale-105 ring-4 ring-green-500/30"; 
      if (selectedAnswer === opt && opt !== correctAnswer) 
        return "bg-red-500 text-white border-red-600 opacity-80"; 
      return "bg-slate-700/50 text-slate-400 opacity-30 blur-[1px]"; 
    }
    if (selectedAnswer === opt) 
        return "bg-amber-400 border-amber-500 text-slate-900 shadow-xl scale-105 ring-4 ring-amber-400/30";
    return "bg-white/10 border-white/10 hover:bg-white/20 hover:border-white/30 text-white";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 -z-10" />

      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-20">
        <button onClick={() => navigate("/")} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition backdrop-blur-md">
          <Home size={20} />
        </button>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-red-500/30">
            <div className={`w-2 h-2 bg-red-500 rounded-full ${isConnected ? "animate-pulse" : ""}`} />
            <span className="font-bold text-xs tracking-wider text-red-400">{isConnected ? "LIVE" : "..."}</span>
          </div>
          {participants > 0 && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-white/10 text-sm">
              <Users size={14} className="text-emerald-400" />
              <span className="font-bold">{participants}</span>
            </div>
          )}
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {(!canAnswer || isSpectator) && (
        <div className="absolute top-36 z-30 bg-slate-800/90 border border-white/10 px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-in slide-in-from-top-5">
          <Eye size={16} className="text-yellow-400"/>
          <span>Bạn đang xem với tư cách <b>{isSpectator ? "Khán giả" : "Khách"}</b></span>
        </div>
      )}

      <div className="w-full max-w-3xl relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          
          {gameState === "ELIMINATED_SCREEN" && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center bg-red-900/80 p-10 rounded-3xl border-2 border-red-500 shadow-2xl backdrop-blur-md max-w-md w-full"
            >
              <XCircle size={80} className="text-red-400 mx-auto mb-4" />
              <h2 className="text-4xl font-black mb-2 text-white">BẠN ĐÃ BỊ LOẠI</h2>
              <p className="text-red-200 text-lg mb-8">{waitingMsg}</p>
              
              <div className="flex flex-col gap-3">
                  <button onClick={handleContinueWatching} className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg">
                    <Eye size={20} /> Tiếp tục xem kết quả
                  </button>
                  <button onClick={() => navigate("/")} className="w-full bg-white text-red-900 px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
                    Thoát ra trang chủ
                  </button>
              </div>
            </motion.div>
          )}

          {gameState === "WAITING" && (
             <div className="text-center">
                <Trophy size={100} className="text-amber-400 mx-auto mb-6 animate-bounce-slow" />
                <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">THI ĐÌNH</span>
                </h1>
                <p className="text-slate-400 text-lg mb-8">{waitingMsg}</p>
                <div className="flex justify-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-75" />
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-150" />
                </div>
             </div>
          )}

          {(gameState === "PLAYING" || gameState === "RESULT") && question && (
            <div className="w-full px-4">
              <div className="relative w-full h-3 bg-slate-800 rounded-full mb-8 overflow-hidden border border-slate-700/50">
                <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${timer <= 5 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${(timer / (question.timeLeft || 15)) * 100}%` }} />
              </div>

              <div className="bg-white text-slate-900 p-8 md:p-10 rounded-[2rem] shadow-2xl text-center mb-8 relative border-b-8 border-slate-200">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border-4 border-white text-white font-black text-xl shadow-xl">
                  {timer}
                </div>
                <h2 className="text-xl md:text-2xl font-black mt-4 leading-tight">
                  {question.content}
                </h2>
                
                {gameState === "RESULT" && correctAnswer && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl font-bold animate-in fade-in slide-in-from-top-2 border border-green-200 shadow-inner">
                        Đáp án đúng: {correctAnswer}
                    </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleSelectAnswer(opt)} disabled={selectedAnswer !== null || isEliminated || isSpectator || !canAnswer}
                    className={`p-5 rounded-2xl font-bold text-lg transition-all duration-200 transform border-2 text-left relative overflow-hidden group ${(!canAnswer && !isSpectator) ? "opacity-60 cursor-not-allowed" : ""} ${getOptionStyle(opt)}`}
                  >
                    <span>{opt}</span>
                    {gameState === "RESULT" && opt === correctAnswer && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />}
                    {gameState === "RESULT" && selectedAnswer === opt && opt !== correctAnswer && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />}
                  </button>
                ))}
              </div>

              {gameState === "RESULT" && (
                 <div className="flex justify-center w-full">
                    <Leaderboard data={leaderboard} />
                 </div>
              )}
            </div>
          )}

          {gameState === "WINNER" && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full max-w-lg">
              <div className="relative inline-block">
                  <div className="absolute inset-0 bg-yellow-500 blur-[60px] opacity-40 rounded-full"></div>
                  <Trophy size={140} className="text-yellow-400 mx-auto mb-6 relative z-10 drop-shadow-2xl" />
              </div>
              
              <h2 className="text-5xl font-black text-white mb-2 tracking-tight">KẾT THÚC!</h2>
              
              {winner ? (
                  <div className="mb-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
                      <p className="text-slate-300 text-lg mb-4 uppercase tracking-widest font-bold">Người chiến thắng là</p>
                      <div className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 p-4 pr-8 rounded-full border border-yellow-500/50 backdrop-blur-md shadow-2xl">
                          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-yellow-900 font-bold text-3xl shadow-lg border-4 border-yellow-200 overflow-hidden">
                              {winner.avatar ? <img src={winner.avatar} className="w-full h-full object-cover" alt="avatar"/> : (winner.name?.charAt(0) || "U")}
                          </div>
                          <div className="text-left">
                              <h3 className="text-3xl font-black text-yellow-300 drop-shadow-md">{winner.name || "Ẩn danh"}</h3>
                              <p className="text-yellow-100 font-mono font-bold text-lg">{winner.score} điểm</p>
                          </div>
                      </div>
                  </div>
              ) : (
                  <p className="text-slate-300 text-xl mb-8">Không có người chiến thắng.</p>
              )}
              
              <div className="flex justify-center w-full mb-8">
                 <Leaderboard data={leaderboard} />
              </div>

              <button onClick={() => navigate("/")} className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition shadow-xl flex items-center gap-2 mx-auto">
                <Home size={20} /> Về trang chủ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveBattle;