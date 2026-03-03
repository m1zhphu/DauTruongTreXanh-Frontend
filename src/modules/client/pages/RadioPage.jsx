import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useRadio } from '../context/RadioContext';
import RadioService from '../../../services/RadioService';
import { 
    Play, Pause, Headphones, Music, BookOpen, 
    Scale, Moon, Sparkles, AudioWaveform, ArrowLeft 
} from 'lucide-react';

const RadioPage = () => {
    const navigate = useNavigate(); // Hook điều hướng
    const { playTrack, currentTrack, isPlaying } = useRadio();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await RadioService.getAllPublic();
                setTracks(res.data);
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredTracks = filter === 'ALL' 
        ? tracks 
        : tracks.filter(t => t.type === filter);

    const getCategoryStyle = (type) => {
        switch(type) {
            case 'HISTORY': return { icon: <BookOpen size={14}/>, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' };
            case 'LAW': return { icon: <Scale size={14}/>, color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' };
            case 'SLEEP_STORY': return { icon: <Moon size={14}/>, color: 'text-indigo-700', bg: 'bg-indigo-100', border: 'border-indigo-200' };
            default: return { icon: <Music size={14}/>, color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' };
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-serif text-[#2D2420]">
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* --- BACK BUTTON --- */}
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-[#5D4037] hover:text-[#3E2723] hover:bg-[#EFEBE9] px-4 py-2 rounded-full transition-all mb-4 group font-sans font-bold animate-fade-in"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> 
                    Quay về Trang Chủ
                </button>

                {/* --- HEADER --- */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-[#3E2723] text-amber-400 rounded-full mb-4 shadow-xl shadow-amber-900/20">
                        <Sparkles size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 text-[#3E2723] tracking-tight">
                        Đài Phát Thanh Dân Gian
                    </h1>
                    <p className="text-lg text-[#5D4037] opacity-80 max-w-2xl mx-auto font-sans">
                        "Lắng nghe tiếng vọng ngàn xưa, hấp thụ tri thức trong từng giai điệu."
                    </p>
                </div>

                {/* --- FILTER BUTTONS --- */}
                <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'ALL', label: 'Tất cả' },
                        { key: 'HISTORY', label: '📜 Lịch Sử' },
                        { key: 'LAW', label: '⚖️ Pháp Luật' },
                        { key: 'LOFI', label: '🎵 Nhạc Lofi' },
                        { key: 'SLEEP_STORY', label: '🌙 Kể Chuyện' },
                    ].map((btn) => (
                        <button
                            key={btn.key}
                            onClick={() => setFilter(btn.key)}
                            className={`px-5 py-2 rounded-full font-sans font-bold text-sm transition-all duration-300 border
                                ${filter === btn.key 
                                    ? 'bg-[#3E2723] text-amber-400 border-[#3E2723] shadow-lg transform scale-105' 
                                    : 'bg-white text-[#5D4037] border-[#D7CCC8] hover:bg-[#EFEBE9] hover:border-[#8D6E63]'
                                }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* --- TRACK LIST --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredTracks.map((track, idx) => {
                            const isCurrent = currentTrack?.id === track.id;
                            const style = getCategoryStyle(track.type);

                            return (
                                <div 
                                    key={track.id}
                                    onClick={() => playTrack(track)}
                                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
                                        animate-slide-up
                                        ${isCurrent 
                                            ? 'bg-white border-amber-500 shadow-xl shadow-amber-500/10' 
                                            : 'bg-white border-[#E0E0E0] hover:border-amber-300 hover:shadow-lg hover:-translate-y-1'
                                        }`}
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    {isCurrent && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>}

                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 shrink-0">
                                            <div className={`w-full h-full rounded-xl shadow-inner flex items-center justify-center text-2xl
                                                ${isCurrent ? 'bg-amber-100' : 'bg-gray-100 group-hover:bg-amber-50'} transition-colors`}>
                                                {style.icon}
                                            </div>
                                            
                                            <div className={`absolute inset-0 rounded-xl flex items-center justify-center transition-all duration-300
                                                ${isCurrent ? 'bg-amber-500/90 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                                                {isCurrent && isPlaying ? (
                                                    <div className="flex gap-1 h-4 items-end">
                                                        <div className="w-1 bg-white animate-bounce-bar" style={{animationDelay: '0s'}}></div>
                                                        <div className="w-1 bg-white animate-bounce-bar" style={{animationDelay: '0.2s'}}></div>
                                                        <div className="w-1 bg-white animate-bounce-bar" style={{animationDelay: '0.4s'}}></div>
                                                    </div>
                                                ) : (
                                                    <Play size={24} className="text-white fill-current ml-1"/>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`font-bold text-lg truncate pr-2 ${isCurrent ? 'text-amber-800' : 'text-gray-800'}`}>
                                                    {track.title}
                                                </h3>
                                                {isCurrent && <span className="flex h-2 w-2 relative">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                </span>}
                                            </div>
                                            
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5 font-sans mb-2">
                                                <Headphones size={12}/> {track.author}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${style.color} ${style.bg} ${style.border}`}>
                                                    {style.icon} {track.type}
                                                </span>
                                                {track.description && (
                                                    <span className="text-xs text-gray-400 truncate max-w-[120px]">
                                                        {track.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {filteredTracks.length === 0 && !loading && (
                    <div className="text-center py-20 opacity-60">
                        <AudioWaveform size={64} className="mx-auto mb-4 text-[#D7CCC8]" />
                        <p className="text-lg">Không tìm thấy bài hát nào trong mục này.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RadioPage;