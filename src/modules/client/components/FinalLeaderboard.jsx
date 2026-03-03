import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Đảm bảo motion được dùng
import { Home, Crown, Medal } from "lucide-react";
import confetti from "canvas-confetti";

// Import ảnh nhân vật (Giữ nguyên)
import char1 from "../../../assets/h1.gif";
import char2 from "../../../assets/h2.gif";
import char3 from "../../../assets/h4.gif";

// --- 1. CẤU HÌNH GIAO DIỆN TỪNG HẠNG ---
const RANK_CONFIG = {
    1: {
        height: "h-64 md:h-80",
        color: "bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600",
        shadow: "shadow-[0_0_50px_rgba(234,179,8,0.6)]",
        borderColor: "border-yellow-200",
        charSize: "w-48 h-48 md:w-72 md:h-72",
        delay: 0.5,
        zIndex: 30,
        icon: <Crown size={56} className="text-yellow-100 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-bounce" />
    },
    2: {
        height: "h-48 md:h-60",
        color: "bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600",
        shadow: "shadow-[0_0_30px_rgba(148,163,184,0.4)]",
        borderColor: "border-slate-200",
        charSize: "w-36 h-36 md:w-52 md:h-52",
        delay: 0.2,
        zIndex: 20,
        icon: <Medal size={40} className="text-slate-200 fill-slate-400 drop-shadow-md" />
    },
    3: {
        height: "h-36 md:h-48",
        color: "bg-gradient-to-b from-orange-300 via-orange-500 to-orange-700",
        shadow: "shadow-[0_0_30px_rgba(234,88,12,0.4)]",
        borderColor: "border-orange-200",
        charSize: "w-32 h-32 md:w-48 md:h-48",
        delay: 0.3,
        zIndex: 20,
        icon: <Medal size={40} className="text-orange-200 fill-orange-600 drop-shadow-md" />
    }
};

// --- COMPONENT: BỤC ĐỨNG ---
const PodiumStep = ({ player, rank }) => {
    if (!player) return <div className="w-1/3"></div>;
    const config = RANK_CONFIG[rank];

    const characterImage = (player.avatar && player.avatar.length > 10) 
        ? player.avatar 
        : (rank === 1 ? char1 : rank === 2 ? char2 : char3);

    return (
        <div className={`flex flex-col items-center justify-end w-1/3 relative z-${config.zIndex} px-2 md:px-4`}>
            {/* Sử dụng motion.div để sửa lỗi 'motion is defined but never used' */}
            <motion.div
                initial={{ y: -100, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: config.delay + 0.3, type: "spring", stiffness: 120 }}
                className="flex flex-col items-center mb-[-10px] relative z-20 w-full"
            >
                <div className="mb-2">{config.icon}</div>
                <div className={`${config.charSize} transition-transform hover:scale-110 duration-300 relative`}>
                    <img 
                        src={characterImage} 
                        alt="Character" 
                        className="w-full h-full object-contain filter drop-shadow-2xl" 
                    />
                    {rank === 1 && (
                        <div className="absolute inset-0 bg-yellow-400/30 blur-[60px] -z-10 rounded-full"></div>
                    )}
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-lg border border-white/10 mt-[-10px] z-30 min-w-[80px] text-center shadow-xl">
                    <span className="text-xs md:text-sm font-bold truncate max-w-[120px] block text-slate-100">
                        {player.username}
                    </span>
                </div>
            </motion.div>

            {/* Khối bục cũng dùng motion */}
            <motion.div
                initial={{ height: 0 }} animate={{ height: "100%" }}
                transition={{ delay: config.delay, duration: 0.6, ease: "backOut" }}
                className={`w-full ${config.height} flex flex-col relative rounded-t-lg overflow-hidden ${config.shadow} group border-t-2 ${config.borderColor}`}
            >
                <div className={`flex-1 ${config.color} flex flex-col justify-end items-center pb-4 relative`}>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <span className="text-6xl md:text-9xl font-black text-black/10 absolute bottom-6 z-0 mix-blend-overlay">
                        {rank}
                    </span>
                    <div className="relative z-10 bg-black/20 px-4 py-1.5 rounded-md backdrop-blur-sm border border-white/10">
                        <span className="text-white font-black text-lg md:text-2xl font-mono tracking-wider">
                            {player.score}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- COMPONENT: HIỆU ỨNG HẠT BỤI ---
const FloatingParticles = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // SỬA LỖI ESLINT: Dùng setTimeout(..., 0) để biến việc cập nhật state thành bất đồng bộ
        const timer = setTimeout(() => {
            const generatedParticles = Array.from({ length: 35 }).map((_, i) => {
                const size = Math.random() * 4 + 1;
                const color = Math.random() > 0.6 ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)';
                
                return {
                    id: i,
                    size: size,
                    color: color,
                    boxShadow: `0 0 ${size * 2}px ${color}`,
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 20}%`,
                    duration: `${Math.random() * 15 + 10}s`,
                    delay: `${Math.random() * 10}s`
                };
            });
            setParticles(generatedParticles);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
            <style jsx>{`
                @keyframes fall {
                    0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    50% { transform: translateY(60vh) translateX(20px) rotate(180deg); }
                    100% { transform: translateY(120vh) translateX(-20px) rotate(360deg); opacity: 0; }
                }
            `}</style>
            
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        boxShadow: p.boxShadow,
                        left: p.left,
                        top: p.top,
                        animation: `fall ${p.duration} linear infinite`,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    );
};

// --- COMPONENT CHÍNH ---
const FinalLeaderboard = ({ leaderboard, onExit }) => {
    
    useEffect(() => {
        // Cấu hình Z-INDEX cao cho pháo hoa để không bị che
        const defaults = { 
            zIndex: 9999, // QUAN TRỌNG: Đẩy pháo hoa lên trên cùng
            origin: { y: 0.6 } // Bắn từ vị trí giữa màn hình
        };

        // 1. Pháo hoa lớn ban đầu
        const duration = 3000;
        const end = Date.now() + duration;
        const frame = () => {
            // Bắn từ bên trái
            confetti({ 
                ...defaults, 
                particleCount: 3, 
                angle: 60, 
                spread: 55, 
                origin: { x: 0 }, 
                colors: ['#FFD700', '#FFFFFF'] 
            });
            // Bắn từ bên phải
            confetti({ 
                ...defaults, 
                particleCount: 3, 
                angle: 120, 
                spread: 55, 
                origin: { x: 1 }, 
                colors: ['#FFD700', '#FFFFFF'] 
            });
            
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();

        // 2. Pháo hoa nhỏ từ dưới lên
        const bottomFireworksInterval = setInterval(() => {
            const randomX = 0.2 + Math.random() * 0.6;
            confetti({
                zIndex: 9999, // QUAN TRỌNG
                particleCount: 25,
                startVelocity: 30,
                spread: 40,
                ticks: 120,
                origin: { x: randomX, y: 1.1 }, // Bắn từ dưới đáy màn hình
                colors: ['#fbbf24', '#f59e0b', '#ffffff', '#e2e8f0'],
                gravity: 0.8,
                scalar: 0.7,
                drift: (Math.random() - 0.5) * 0.5
            });
        }, 2000);

        return () => clearInterval(bottomFireworksInterval);
    }, []);

    const top3 = [leaderboard[1], leaderboard[0], leaderboard[2]];
    const others = leaderboard.slice(3);

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex flex-col items-center relative overflow-hidden font-sans selection:bg-yellow-500 selection:text-black">
            
            {/* Background & Hiệu ứng */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]"></div>
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                
                {/* Component Hạt bụi */}
                <FloatingParticles />
            </div>

            <button 
                onClick={onExit} 
                className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 group"
                title="Về trang chủ"
            >
                <Home size={20} className="group-hover:text-yellow-400 transition-colors"/>
            </button>

            {/* Sử dụng motion.div ở đây nữa */}
            <motion.div 
                initial={{ y: -50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                className="z-10 mt-12 mb-2 text-center"
            >
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 uppercase tracking-wider drop-shadow-sm">
                    BẢNG XẾP HẠNG
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-4 rounded-full"></div>
            </motion.div>

            <div className="z-10 w-full max-w-5xl flex items-end justify-center px-4 mt-auto mb-12 h-[550px] md:h-[650px]">
                <PodiumStep player={top3[0]} rank={2} />
                <PodiumStep player={top3[1]} rank={1} />
                <PodiumStep player={top3[2]} rank={3} />
            </div>

            {others.length > 0 && (
                <div className="z-10 w-full max-w-2xl px-4 mb-16">
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        {others.map((user, idx) => (
                            <div key={idx} className="flex items-center justify-between py-3 px-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition group">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-sm">
                                        #{idx + 4}
                                    </div>
                                    <span className="text-white font-medium text-lg group-hover:text-yellow-400 transition-colors">
                                        {user.username}
                                    </span>
                                </div>
                                <span className="font-mono font-bold text-slate-300 group-hover:text-white">
                                    {user.score} pts
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default FinalLeaderboard;