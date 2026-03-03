import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Users, ArrowRight, Trophy, Home, Loader2, Pause, Play as PlayIcon, CheckCircle2, Crown, Sparkles, Zap, Timer, Music, Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIG ---
import FinalLeaderboard from "../components/FinalLeaderboard";
import API_BASE_URL from "../../../services/apiConfig";
const WS_URL = API_BASE_URL.replace('/api', '/ws-game');

const getFrontendUrl = () => {
    try {
        const apiUrl = new URL(API_BASE_URL);
        return `${apiUrl.protocol}//${apiUrl.hostname}:5173`;
    } catch {
        return window.location.origin;
    }
};
const FRONTEND_BASE_URL = getFrontendUrl();

// --- COMPONENTS GIAO DIỆN (UI COMPONENTS) ---

// 1. Background động
const GalaxyBackground = () => (
    <div className="fixed inset-0 z-0 bg-[#050511] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#050511] to-[#050511]" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px]" />
        <motion.div animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
    </div>
);

// 2. Card hiệu ứng kính
const GlassCard = ({ children, className = "", hoverEffect = false, onClick }) => (
    <motion.div 
        onClick={onClick}
        className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden ${className}`}
        whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 40px -10px rgba(124, 58, 237, 0.2)" } : {}}
    >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
        {children}
    </motion.div>
);

// --- MAIN COMPONENT ---
const QuizGame = () => {
    const { roomCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isHost = location.state?.isHost || false;
    const username = useMemo(() => location.state?.username || "Guest_" + Math.floor(Math.random() * 1000), [location.state?.username]);

    const [gameState, setGameState] = useState("LOBBY");
    const [players, setPlayers] = useState({});
    const [question, setQuestion] = useState(null);
    const [roundResult, setRoundResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [maxTime, setMaxTime] = useState(15);
    const [isPaused, setIsPaused] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [selectedAnswerIdx, setSelectedAnswerIdx] = useState(null);

    // State mới để bật/tắt hiển thị mã PIN/QR
    const [isInfoExpanded, setIsInfoExpanded] = useState(true);

    const stompClientRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const isConnectingRef = useRef(false);

    // --- LOGIC (Giữ nguyên) ---
    const startTimer = useCallback((seconds) => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setMaxTime(seconds);
        setTimeLeft(seconds * 100);
        setIsPaused(false);
        timerIntervalRef.current = setInterval(() => {
            if (!isPaused) {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        clearInterval(timerIntervalRef.current);
                        return 0;
                    }
                    return prev - 10;
                });
            }
        }, 100);
    }, [isPaused]);

    const togglePause = () => setIsPaused(!isPaused);

    const handleSocketMessage = (msg) => {
        switch (msg.type) {
            case "PLAYER_JOINED": setPlayers(msg.data); break;
            case "NEW_QUESTION":
                setGameState("PLAYING");
                setQuestion(msg.data);
                setAnswered(false);
                setSelectedAnswerIdx(null);
                setRoundResult(null);
                startTimer(msg.data.time || 15);
                break;
            case "ROUND_RESULT":
                setGameState("RESULT");
                setRoundResult(msg.data);
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                break;
            case "GAME_OVER":
                setGameState("FINISHED");
                setRoundResult({ leaderboard: msg.data });
                confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 }, colors: ['#a855f7', '#ec4899', '#eab308'] });
                break;
            default: break;
        }
    };
    
    const messageHandlerRef = useRef(handleSocketMessage);
    messageHandlerRef.current = handleSocketMessage;

    useEffect(() => {
        if (!roomCode || isConnectingRef.current || stompClientRef.current) return;
        isConnectingRef.current = true;
        const socket = new SockJS(WS_URL);
        const client = Stomp.over(socket);
        client.debug = null;
        client.connect({}, () => {
            isConnectingRef.current = false;
            client.subscribe(`/topic/quiz/${roomCode}`, (msg) => {
                if (msg.body) messageHandlerRef.current(JSON.parse(msg.body));
            });
            if (!isHost) client.send(`/app/quiz/${roomCode}/join`, {}, JSON.stringify({ username, avatar: "😊" }));
        }, () => isConnectingRef.current = false);
        stompClientRef.current = client;
        return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
    }, [roomCode, isHost, username]);

    const handleStartGame = () => stompClientRef.current?.send(`/app/quiz/${roomCode}/start`, {}, "{}");
    const handleNext = () => {
        const endpoint = gameState === "PLAYING" ? "next" : gameState === "RESULT" ? "next-q" : null;
        if (endpoint) stompClientRef.current?.send(`/app/quiz/${roomCode}/${endpoint}`, {}, "{}");
        if (gameState === "FINISHED") navigate('/');
    };
    const handleAnswer = (ans, idx) => {
        if (answered || isHost) return;
        if (navigator.vibrate) navigator.vibrate(50);
        setAnswered(true);
        setSelectedAnswerIdx(idx);
        stompClientRef.current?.send(`/app/quiz/${roomCode}/answer`, {}, JSON.stringify({ username, answer: ans }));
    };

    // --- HELPER RENDER AVATAR ---
    const renderAvatar = (avatarString) => {
        if (avatarString && (avatarString.startsWith('http') || avatarString.startsWith('data:'))) {
            return <img src={avatarString} alt="Avt" className="w-full h-full object-cover rounded-full" />;
        }
        return <span className="text-xl md:text-2xl">{avatarString || "😊"}</span>;
    };

    // ================= PHẦN GIAO DIỆN =================

    // --- 1. LOBBY SCREEN ---
    if (gameState === "LOBBY") {
        return (
            <div className="min-h-screen flex flex-col font-sans text-white relative overflow-hidden">
                <GalaxyBackground />
                
                {/* Back Button */}
                <div className="absolute top-6 left-6 z-20">
                     <button onClick={() => navigate('/')} className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition group">
                        <Home size={20} className="text-slate-300 group-hover:text-white"/>
                    </button>
                </div>

                {/* --- MAIN PLAYER AREA --- */}
                <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col relative z-10 pt-20 pb-32">
                    
                    {/* Header */}
                    <div className="flex justify-between items-end mb-6 px-2">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                {isHost ? "Đang chờ người chơi..." : "Đã tham gia!"}
                            </h2>
                            <p className="text-slate-400 mt-1 font-medium">
                                {isHost ? "Hãy bắt đầu khi mọi người đã sẵn sàng." : "Hãy nhìn lên màn hình chính."}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                            <Users size={20} className="text-purple-300"/>
                            <span className="text-xl font-bold">{Object.keys(players).length}</span>
                        </div>
                    </div>

                    {/* Player Grid */}
                    <GlassCard className="flex-1 rounded-[2rem] p-6 overflow-hidden flex flex-col">
                         <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 content-start custom-scrollbar">
                            <AnimatePresence>
                                {Object.keys(players).map((p, i) => (
                                    <motion.div 
                                        key={p} 
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="bg-slate-800/40 hover:bg-slate-700/60 p-3 rounded-2xl border border-white/5 flex flex-col items-center gap-2 group transition-colors cursor-default relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 p-0.5 shadow-lg relative z-10">
                                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                                {renderAvatar(players[p])}
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-200 truncate text-sm w-full text-center relative z-10">
                                            {p}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {Object.keys(players).length === 0 && (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-500 gap-4 opacity-70">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                                        <Loader2 size={48} className="relative animate-spin text-purple-400"/>
                                    </div>
                                    <p className="font-medium tracking-wide">Đang đợi kết nối...</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {/* --- JOIN INFO FOOTER (EXPANDABLE) --- */}
                <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
                    <motion.div 
                        initial={false}
                        animate={{ height: isInfoExpanded ? "auto" : "80px" }}
                        className="w-full max-w-4xl mx-4 mb-4 pointer-events-auto"
                    >
                        <GlassCard className="rounded-[2rem] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border border-white/20 bg-[#0f172a]/95 backdrop-blur-3xl">
                            
                            {/* Bar Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors" onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Game PIN</span>
                                        <span className="text-3xl font-black text-white tracking-wider font-mono leading-none">{roomCode}</span>
                                    </div>
                                    {!isInfoExpanded && (
                                        <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6 animate-in fade-in slide-in-from-bottom-2">
                                            <span className="text-sm font-medium text-slate-300">Tham gia tại <span className="text-purple-400 font-bold">quiz.arena</span></span>
                                            <QRCodeSVG value={`${FRONTEND_BASE_URL}/quiz/join?code=${roomCode}`} size={32} className="rounded bg-white p-0.5"/>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    {isHost && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleStartGame(); }}
                                            className="px-6 py-2 bg-white text-slate-900 rounded-full font-black text-sm hover:bg-purple-50 hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                                        >
                                            START <ArrowRight size={16}/>
                                        </button>
                                    )}
                                    <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                                        {isInfoExpanded ? <ChevronDown size={20}/> : <ChevronUp size={20}/>}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {isInfoExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="px-8 pb-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-8"
                                    >
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="mb-2 flex items-center justify-center md:justify-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-purple-300 font-bold text-sm tracking-wide uppercase">Live Lobby</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold mb-2">Tham gia trò chơi</h3>
                                            <p className="text-slate-400 mb-1">1. Truy cập <span className="text-white font-bold">quiz.arena</span></p>
                                            <p className="text-slate-400">2. Nhập mã PIN ở trên để vào phòng</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                                            <QRCodeSVG value={`${FRONTEND_BASE_URL}/quiz/join?code=${roomCode}`} size={140} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        );
    }

    // --- 2. GAME SCREEN (ĐÃ SỬA LẠI LAYOUT HÌNH ẢNH) ---
    if (gameState === "PLAYING" && question) {
        const progress = (timeLeft / (maxTime * 100)) * 100;
        const currentScore = Math.round((timeLeft / (maxTime * 100)) * 1000);
        
        const optionStyles = [
            { bg: "bg-red-500", border: "border-red-600", shadow: "shadow-red-900/50", icon: "▲" },
            { bg: "bg-blue-500", border: "border-blue-600", shadow: "shadow-blue-900/50", icon: "◆" },
            { bg: "bg-yellow-500", border: "border-yellow-600", shadow: "shadow-yellow-900/50", icon: "●" },
            { bg: "bg-green-500", border: "border-green-600", shadow: "shadow-green-900/50", icon: "■" },
        ];

        return (
            <div className="h-[100dvh] w-full flex flex-col font-sans relative overflow-hidden text-white bg-slate-950">
                <GalaxyBackground />

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-800 z-50">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 shadow-[0_0_15px_rgba(236,72,153,0.7)]"
                        initial={{ width: "100%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                </div>

                <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-2 md:p-6 relative z-10 h-full overflow-hidden">
                    
                    {/* Header Strip */}
                    <div className="shrink-0 flex justify-between items-center mb-2 md:mb-4 bg-slate-900/40 backdrop-blur-md rounded-2xl p-2 border border-white/5">
                        <div className="px-3 py-1 md:px-4 md:py-2 bg-white/5 rounded-xl flex flex-col items-center min-w-[60px] md:min-w-[80px]">
                            <span className="text-[8px] md:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Câu hỏi</span>
                            <span className="text-sm md:text-xl font-black text-white">{question.index}<span className="text-slate-500 text-xs md:text-sm">/{question.total}</span></span>
                        </div>
                        
                        <div className="relative -mt-4 md:-mt-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-900 border-4 border-purple-500 flex items-center justify-center font-black text-lg md:text-2xl shadow-[0_0_20px_rgba(168,85,247,0.5)] z-10 relative text-white">
                                {Math.ceil(timeLeft / 100)}
                            </div>
                        </div>

                        <div className="px-3 py-1 md:px-4 md:py-2 bg-white/5 rounded-xl flex flex-col items-center min-w-[60px] md:min-w-[80px]">
                            <span className="text-[8px] md:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Điểm</span>
                            <span className="text-sm md:text-xl font-black text-yellow-400">{currentScore}</span>
                        </div>
                    </div>

                    {/* Question Card Area (Flexible) */}
                    <div className="flex-1 flex flex-col min-h-0 justify-center items-center mb-2 relative">
                        {isHost && (
                            <div className="absolute top-0 right-0 z-50 flex gap-2 scale-75 md:scale-100 origin-top-right">
                                <button onClick={togglePause} className="p-2 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm text-white transition">
                                    {isPaused ? <PlayIcon size={20}/> : <Pause size={20}/>}
                                </button>
                                <button onClick={handleNext} className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-full hover:bg-slate-200 transition">Skip</button>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={question.text}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="w-full h-full flex flex-col"
                            >
                                <GlassCard className={`
                                    w-full h-full rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden
                                    flex flex-col md:flex-row
                                `}>
                                    {/* Image Section: Mobile (Top fixed height), Desktop (Left) */}
                                    {question.image && (
                                        <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-full bg-black/30 flex items-center justify-center relative shrink-0 border-b md:border-b-0 md:border-r border-white/5">
                                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"/>
                                            <img 
                                                src={question.image} 
                                                alt="Q" 
                                                className="h-full w-full object-contain relative z-10 p-2 md:p-4" 
                                                onError={(e) => e.target.style.display='none'}
                                            />
                                        </div>
                                    )}

                                    {/* Text Section: Mobile (Bottom flex), Desktop (Right) */}
                                    <div className={`
                                        flex-1 flex flex-col items-center justify-center p-4 md:p-8 
                                        ${question.image ? 'w-full md:w-1/2' : 'w-full h-full'}
                                        overflow-y-auto
                                    `}>
                                        <h2 className={`
                                            font-bold leading-tight text-balance text-white drop-shadow-lg text-center
                                            ${question.image ? 'text-lg md:text-3xl' : 'text-xl md:text-4xl'}
                                        `}>
                                            {question.text}
                                        </h2>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Answers Grid (Fixed Height Bottom) */}
                    <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 pb-safe">
                        {question.options.map((opt, idx) => {
                            const style = optionStyles[idx % 4];
                            const isSelected = answered && selectedAnswerIdx === idx;
                            const isDimmed = answered && selectedAnswerIdx !== idx;

                            const ButtonInner = () => (
                                <div className="flex items-center gap-3 md:gap-4 w-full px-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-black/20 flex items-center justify-center text-white text-sm md:text-lg font-black shrink-0 shadow-sm border border-white/10">
                                        {style.icon}
                                    </div>
                                    <span className="text-sm md:text-xl font-bold text-white text-left leading-snug line-clamp-2">
                                        {opt}
                                    </span>
                                </div>
                            );

                            if (isHost) {
                                return (
                                    <div key={idx} className={`${style.bg} rounded-xl md:rounded-2xl p-3 md:p-4 h-16 md:h-20 flex items-center shadow-lg border-b-4 border-black/20 opacity-90`}>
                                        <ButtonInner />
                                    </div>
                                );
                            }

                            return (
                                <motion.button
                                    key={idx}
                                    onClick={() => handleAnswer(opt, idx)}
                                    disabled={answered}
                                    whileTap={!answered ? { scale: 0.96, translateY: 2 } : {}}
                                    className={`
                                        relative rounded-xl md:rounded-2xl p-2 md:p-4 
                                        h-16 md:h-24
                                        flex items-center 
                                        transition-all duration-150 shadow-md md:shadow-xl border-b-[4px] md:border-b-[6px]
                                        ${style.bg} ${style.border} ${style.shadow}
                                        ${isDimmed ? 'opacity-40 grayscale cursor-not-allowed border-b-0 translate-y-[4px]' : ''}
                                        ${isSelected ? 'ring-2 md:ring-4 ring-white ring-offset-2 ring-offset-slate-900 border-b-0 translate-y-[4px] !opacity-100 !grayscale-0' : ''}
                                        ${!answered ? 'active:brightness-90' : ''}
                                    `}
                                >
                                    <ButtonInner />
                                    {isSelected && <div className="absolute top-2 right-2 bg-white text-slate-900 rounded-full p-0.5 md:p-1"><CheckCircle2 size={12} className="md:w-4 md:h-4"/></div>}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // --- 3. LEADERBOARD SCREEN ---
    if (gameState === "RESULT" || (gameState === "FINISHED" && roundResult?.leaderboard)) {
        const isFinal = gameState === "FINISHED";
        if (isFinal) return <FinalLeaderboard leaderboard={roundResult.leaderboard} onExit={() => navigate('/')} />;

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 font-sans text-white bg-slate-950 relative overflow-hidden">
                <GalaxyBackground />
                <GlassCard className="w-full max-w-4xl rounded-[3rem] p-8 md:p-12 flex flex-col items-center z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 text-purple-200 text-sm font-bold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            <Trophy size={16} className="text-yellow-400" /> Leaderboard
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white drop-shadow-sm">
                            Ai đang dẫn đầu?
                        </h1>
                    </div>
                    <div className="w-full space-y-3 mb-12">
                        <AnimatePresence>
                            {roundResult?.leaderboard?.slice(0, 5).map((user, idx) => {
                                let badge = { bg: "bg-slate-700", text: "text-slate-300", icon: null };
                                let rowStyle = "bg-white/5 border-l-4 border-slate-600";
                                if (idx === 0) { 
                                    badge = { bg: "bg-gradient-to-br from-yellow-300 to-yellow-600", text: "text-yellow-900", icon: <Crown size={14} fill="currentColor"/> }; 
                                    rowStyle = "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.1)]"; 
                                }
                                if (idx === 1) { 
                                    badge = { bg: "bg-gradient-to-br from-slate-300 to-slate-500", text: "text-slate-900", icon: null }; 
                                    rowStyle = "bg-white/5 border-l-4 border-slate-300"; 
                                }
                                if (idx === 2) { 
                                    badge = { bg: "bg-gradient-to-br from-orange-400 to-orange-700", text: "text-orange-100", icon: null }; 
                                    rowStyle = "bg-white/5 border-l-4 border-orange-500"; 
                                }
                                return (
                                    <motion.div
                                        key={user.username}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1, type: "spring" }}
                                        className={`flex items-center justify-between p-4 rounded-xl ${rowStyle} backdrop-blur-md transition-all hover:scale-[1.01]`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 flex items-center justify-center rounded-lg font-black text-xl shadow-lg ${badge.bg} ${badge.text}`}>
                                                {badge.icon || idx + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg md:text-xl text-white">{user.username}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-black text-2xl text-purple-300 tabular-nums">{user.score}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Points</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                    {isHost ? (
                        <button onClick={handleNext} className="group relative px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                CÂU TIẾP THEO <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                            </span>
                        </button>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-purple-300 animate-pulse">
                             <div className="h-2 w-32 bg-purple-500/30 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-1/2 animate-[shimmer_2s_infinite]"></div>
                             </div>
                             <span className="text-sm font-bold tracking-widest uppercase">Đang đợi Host...</span>
                        </div>
                    )}
                </GlassCard>
            </div>
        );
    }

    // --- LOADING SCREEN ---
    return (
        <div className="min-h-screen bg-[#050511] flex flex-col items-center justify-center text-white relative">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 to-transparent"></div>
             <Loader2 size={60} className="animate-spin text-indigo-500 mb-6 relative z-10" />
             <p className="font-bold text-xl tracking-[0.5em] uppercase text-indigo-200 relative z-10 animate-pulse">Loading...</p>
        </div>
    );
};

export default QuizGame;