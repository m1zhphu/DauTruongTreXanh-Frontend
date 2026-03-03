import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import RadioService from '../../../services/RadioService';
import { getFullAudioUrl } from '../../../utils/urlHelper';
import { 
    Plus, Edit, Trash2, Play, Pause, 
    Mic, CheckCircle, XCircle, Link as LinkIcon, FileAudio 
} from 'lucide-react';

const RadioManager = () => {
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State nghe thử
    const [previewTrack, setPreviewTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const fetchTracks = async () => {
        try {
            const res = await RadioService.getAllAdmin();
            setTracks(res.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTracks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài này không?")) {
            try {
                await RadioService.delete(id);
                fetchTracks();
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Xóa thất bại!");
            }
        }
    };

    const handlePlayPreview = (track) => {
        if (previewTrack?.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setPreviewTrack(track);
            setIsPlaying(true);
        }
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'HISTORY': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Lịch Sử</span>;
            case 'LAW': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Pháp Luật</span>;
            case 'LOFI': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">Nhạc Lofi</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">Khác</span>;
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            
            {/* PLAYER ẨN DÙNG CHO ADMIN */}
            {previewTrack && (
                <div className="fixed bottom-0 right-0 w-0 h-0 overflow-hidden">
                    <ReactPlayer 
                        url={getFullAudioUrl(previewTrack.audioUrl)}
                        playing={isPlaying}
                        onEnded={() => setIsPlaying(false)}
                        config={{ youtube: { playerVars: { showinfo: 0 } } }}
                    />
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Đài Phát Thanh</h1>
                    <p className="text-gray-500 mt-1">Danh sách podcast, nhạc nền và bài học thụ động.</p>
                </div>
                <button onClick={() => navigate("/admin/radio/new")} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1">
                    <Plus size={20} /> Thêm Bài Mới
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="p-5 font-bold w-16">ID</th>
                                    <th className="p-5 font-bold">Thông tin bài hát</th>
                                    <th className="p-5 font-bold">Thể loại</th>
                                    <th className="p-5 font-bold">Nguồn</th>
                                    <th className="p-5 font-bold text-center">Trạng thái</th>
                                    <th className="p-5 font-bold text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tracks.map((track) => {
                                    const isCurrent = previewTrack?.id === track.id;
                                    return (
                                        <tr key={track.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="p-5 text-gray-400 font-mono">#{track.id}</td>
                                            <td className="p-5">
                                                <div className="font-bold text-gray-800 text-lg mb-1">{track.title}</div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Mic size={14} className="text-emerald-500"/> 
                                                    {track.author || "Không rõ tác giả"}
                                                </div>
                                            </td>
                                            <td className="p-5">{getTypeBadge(track.type)}</td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-2 items-start">
                                                    {track.audioUrl && track.audioUrl.startsWith('http') && !track.audioUrl.includes('192.168.') ? (
                                                        <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                            <LinkIcon size={10}/> Online Link
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                                            <FileAudio size={10}/> File Upload
                                                        </span>
                                                    )}
                                                    <button 
                                                        onClick={() => handlePlayPreview(track)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all ${isCurrent && isPlaying ? 'text-emerald-700 bg-emerald-100 border-emerald-300' : 'text-gray-600 border-gray-200 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                                    >
                                                        {isCurrent && isPlaying ? <><Pause size={16}/> Đang phát</> : <><Play size={16}/> Nghe thử</>}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                {track.isActive ? (
                                                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-md border border-green-100"><CheckCircle size={14}/> Hiện</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-gray-400 text-sm font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-200"><XCircle size={14}/> Ẩn</span>
                                                )}
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => navigate(`/admin/radio/edit/${track.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(track.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RadioManager;