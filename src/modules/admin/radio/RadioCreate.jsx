import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Radio, FileAudio, Save, User, 
    Link as LinkIcon, UploadCloud, Layers, Activity, Youtube 
} from 'lucide-react';
import RadioService from '../../../services/RadioService';

const RadioCreate = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    
    // State quản lý loại nguồn phát
    const [sourceType, setSourceType] = useState('LINK'); // 'LINK' hoặc 'FILE'
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        type: 'HISTORY',
        audioUrl: '', // Dùng cho link ngoài
        isActive: true
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Tạo FormData để gửi multipart/form-data
            const data = new FormData();
            data.append('title', formData.title);
            data.append('author', formData.author);
            data.append('description', formData.description);
            data.append('type', formData.type);
            data.append('isActive', formData.isActive);

            if (sourceType === 'LINK') {
                data.append('audioUrl', formData.audioUrl);
            } else if (sourceType === 'FILE' && selectedFile) {
                data.append('file', selectedFile);
            }

            await RadioService.create(data);
            alert("🎉 Thêm nội dung thành công!");
            navigate('/admin/radio');
        } catch (error) {
            console.error(error);
            alert("Lỗi! Vui lòng kiểm tra lại server.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button onClick={() => navigate('/admin/radio')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2 transition-colors">
                            <ArrowLeft size={20} /> Quay lại danh sách
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                <Radio size={28} />
                            </span>
                            Thêm Radio / Podcast Mới
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Cột trái: Thông tin chính */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                                <FileAudio className="text-blue-500" size={20} /> Thông tin nội dung
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề <span className="text-red-500">*</span></label>
                                    <input type="text" name="title" required value={formData.title} onChange={handleChange}
                                        placeholder="VD: Sự tích Thánh Gióng"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium text-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <User size={16} className="text-gray-400"/> Tác giả / Nguồn
                                        </label>
                                        <input type="text" name="author" required value={formData.author} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Thể loại</label>
                                        <select name="type" value={formData.type} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                        >
                                            <option value="HISTORY">📜 Lịch Sử</option>
                                            <option value="LAW">⚖️ Pháp Luật</option>
                                            <option value="LOFI">🎵 Nhạc Lofi</option>
                                            <option value="SLEEP_STORY">🌙 Chuyện Đêm Khuya</option>
                                        </select>
                                    </div>
                                </div>

                                {/* --- MEDIA SELECTION --- */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Nguồn Âm Thanh / Video</label>
                                    
                                    {/* Tabs chuyển đổi */}
                                    <div className="flex gap-4 mb-4">
                                        <button type="button" 
                                            onClick={() => setSourceType('LINK')}
                                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${sourceType === 'LINK' ? 'bg-white shadow text-purple-600 border border-purple-200' : 'text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            <LinkIcon size={18}/> Link Online (Youtube/MP3)
                                        </button>
                                        <button type="button"
                                            onClick={() => setSourceType('FILE')}
                                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${sourceType === 'FILE' ? 'bg-white shadow text-purple-600 border border-purple-200' : 'text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            <UploadCloud size={18}/> Upload File
                                        </button>
                                    </div>

                                    {/* Input tương ứng */}
                                    {sourceType === 'LINK' ? (
                                        <div>
                                            <div className="relative">
                                                <input type="url" name="audioUrl" 
                                                    value={formData.audioUrl} onChange={handleChange}
                                                    placeholder="https://youtube.com/... hoặc https://mp3..."
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                />
                                                <Youtube size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"/>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">Hỗ trợ link trực tiếp hoặc Youtube (Player sẽ tự xử lý).</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-purple-300 transition-all">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                                                    <p className="text-sm text-gray-500"><span className="font-semibold">Click để tải lên</span> hoặc kéo thả</p>
                                                    <p className="text-xs text-gray-400">MP3, M4A, MP4 (Max 50MB)</p>
                                                </div>
                                                <input type="file" className="hidden" accept="audio/*,video/*" onChange={handleFileChange} />
                                            </label>
                                            {selectedFile && (
                                                <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-2">
                                                    <FileAudio size={16}/> Đã chọn: {selectedFile.name}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả / Lời dẫn</label>
                                    <textarea name="description" rows="4" value={formData.description} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="Nhập nội dung tóm tắt hoặc lời dẫn cho bài..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Trạng thái & Lưu */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                                <Activity className="text-green-600" size={20} /> Trạng thái
                            </h2>
                            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100" onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="font-medium text-gray-700">
                                    {formData.isActive ? 'Đang Công Khai' : 'Đã Ẩn (Riêng tư)'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Nếu tắt, bài này sẽ không hiện trên trang người dùng nhưng vẫn hiện trong Admin.
                            </p>
                        </div>

                        <div className="sticky bottom-6">
                            <button type="submit" disabled={submitting}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xl shadow-purple-200 transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? "Đang xử lý..." : <><Save size={20} /> Lưu Nội Dung</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RadioCreate;