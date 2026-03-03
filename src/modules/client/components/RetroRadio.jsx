import React, { useState, useEffect, useRef } from 'react';
import { useRadio } from '../context/RadioContext';
import { getFullAudioUrl } from '../../../utils/urlHelper'; 
import { Play, Pause, X, Disc, SkipForward, Volume2, VolumeX, AlertCircle } from 'lucide-react';

const RetroRadio = () => {
    const { currentTrack, isPlaying, setIsPlaying, togglePlay, closeRadio } = useRadio();
    
    // Sử dụng Ref để điều khiển trực tiếp thẻ Video của trình duyệt
    const audioRef = useRef(null);

    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- LOGIC ĐIỀU KHIỂN AUDIO ---
    const audioSrc = currentTrack ? getFullAudioUrl(currentTrack.audioUrl) : '';

    // 1. Xử lý Play/Pause khi state thay đổi
    useEffect(() => {
        if (!audioRef.current || !audioSrc) return;

        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Play thành công -> Xóa log thừa
                        setError(false);
                    })
                    .catch(e => {
                        if (e.name === 'NotAllowedError') {
                            // Lỗi chưa tương tác -> Tắt play để user bấm lại
                            setIsPlaying(false); 
                        } else if (e.name === 'AbortError') {
                            // Bỏ qua lỗi khi đổi bài nhanh
                        } else {
                            // Chỉ log nếu có lỗi lạ
                            console.error("Play Error:", e);
                            setError(true);
                        }
                    });
            }
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, audioSrc, setIsPlaying]);

    // 2. Xử lý Âm lượng / Mute
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            audioRef.current.volume = 1.0; 
        }
    }, [isMuted]);

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[9999] animate-slide-up">
            
            {/* --- THẺ NATIVE VIDEO (ẨN) --- */}
            <video
                ref={audioRef}
                src={audioSrc}
                className="fixed bottom-0 right-0 w-[1px] h-[1px] opacity-0 pointer-events-none"
                playsInline
                preload="auto"
                onLoadStart={() => {
                    setLoading(true); 
                    setIsReady(false);
                }}
                onCanPlay={() => {
                    setLoading(false);
                    setIsReady(true);
                }}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                    console.error("Audio Error:", e.target.error);
                    setError(true);
                    setLoading(false);
                }}
            />

            {/* --- GIAO DIỆN CÁI ĐÀI --- */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                
                <div className="relative w-80 sm:w-96 h-28 bg-[#3E2723] rounded-2xl shadow-2xl flex overflow-hidden border border-[#5D4037]">
                    
                    {/* Phần 1: Loa & Đĩa */}
                    <div className="w-32 bg-[#281815] relative flex items-center justify-center border-r border-[#5D4037]">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8D6E63_1px,transparent_1px)] [background-size:4px_4px]"></div>
                        <div className={`relative w-24 h-24 rounded-full border-4 border-[#1a1a1a] shadow-lg flex items-center justify-center bg-black transition-transform duration-[5000ms] ${isPlaying && !loading ? 'animate-spin-slow' : ''}`}>
                            <div className="absolute inset-0 rounded-full border border-gray-800 opacity-50 scale-90"></div>
                            <div className="w-10 h-10 rounded-full bg-amber-500 overflow-hidden border-2 border-[#3E2723]">
                                {currentTrack.coverUrl ? (
                                    <img src={currentTrack.coverUrl} className="w-full h-full object-cover" alt="cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-amber-600"><Disc size={16} className="text-amber-900"/></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Phần 2: Bảng Điều Khiển */}
                    <div className="flex-1 flex flex-col justify-between p-3 bg-gradient-to-b from-[#4E342E] to-[#3E2723]">
                        {/* Màn hình hiển thị */}
                        <div className={`h-10 rounded border shadow-inner flex items-center px-3 relative overflow-hidden transition-colors ${error ? 'bg-red-900/50 border-red-800' : 'bg-[#212121] border-[#5D4037]'}`}>
                            <div className="w-full">
                                {error ? (
                                    <p className="text-red-400 font-bold text-xs flex items-center gap-1">
                                        <AlertCircle size={12}/> Lỗi tải nhạc!
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-green-500 font-mono text-[10px] uppercase tracking-widest mb-0.5 flex justify-between">
                                            <span className={isPlaying ? "animate-pulse" : ""}>
                                                {loading ? "⏳ BUFFERING..." : (isPlaying ? "● ON AIR" : "○ PAUSED")}
                                            </span>
                                            <span>FM 99.9</span>
                                        </p>
                                        <p className="text-amber-100 font-bold text-xs truncate font-serif tracking-wide">
                                            {currentTrack.title}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Nút bấm */}
                        <div className="flex items-center justify-between gap-2 mt-1">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-[#A1887F] hover:text-[#D7CCC8] p-1">
                                {isMuted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
                            </button>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={togglePlay}
                                    disabled={error}
                                    className={`w-10 h-10 rounded-full bg-gradient-to-b shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center active:scale-95 transition-all border ${error ? 'from-gray-600 to-gray-700 border-gray-600 cursor-not-allowed' : 'from-[#FFCA28] to-[#FF6F00] border-[#E65100]'}`}
                                >
                                    {isPlaying ? <Pause size={18} className="text-[#3E2723] fill-current"/> : <Play size={18} className="text-[#3E2723] fill-current ml-0.5"/>}
                                </button>
                                <button className="text-[#D7CCC8] hover:text-white active:scale-95 transition-transform">
                                    <SkipForward size={20} />
                                </button>
                            </div>
                            <button onClick={closeRadio} className="p-1.5 rounded-full hover:bg-white/10 text-[#8D6E63] hover:text-red-400 transition-colors">
                                <X size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Anten */}
                <div className="absolute -top-10 right-8 w-1 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full -z-10 origin-bottom rotate-12 border-l border-gray-300"></div>
                <div className={`absolute -top-10 right-8 w-2 h-2 bg-red-500 rounded-full -z-10 translate-x-[-2px] translate-y-[-2px] shadow-[0_0_10px_red] ${isPlaying && !loading ? 'animate-pulse' : 'opacity-50'}`}></div>
            </div>
        </div>
    );
};

export default RetroRadio;