import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RadioService from '../../../services/RadioService';
import { 
    ArrowLeft, Radio, FileAudio, Save, 
    User, Link as LinkIcon, Layers, Activity, UploadCloud, Youtube 
} from 'lucide-react';

const RadioEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // State quản lý nguồn phát
    const [sourceType, setSourceType] = useState('LINK'); 
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        type: 'HISTORY',
        audioUrl: '',
        isActive: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await RadioService.getById(id);
                const data = res.data;
                setFormData(data);
                
                // Tự động detect loại nguồn dựa trên URL
                if (data.audioUrl && data.audioUrl.includes('/uploads/')) {
                    setSourceType('FILE');
                } else {
                    setSourceType('LINK');
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                alert("Không tìm thấy bài hát!");
                navigate('/admin/radio');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

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
            // ✅ CHUYỂN DỮ LIỆU SANG FORM DATA ĐỂ GỬI MULTIPART
            const data = new FormData();
            data.append('title', formData.title);
            data.append('author', formData.author);
            data.append('description', formData.description);
            data.append('type', formData.type);
            data.append('isActive', formData.isActive);

            if (sourceType === 'LINK') {
                data.append('audioUrl', formData.audioUrl);
            } else if (sourceType === 'FILE' && selectedFile) {
                // Chỉ gửi file nếu người dùng chọn file mới
                data.append('file', selectedFile);
            } else {
                // Nếu là FILE cũ và không chọn file mới, gửi lại url cũ để backend biết
                data.append('audioUrl', formData.audioUrl);
            }

            // Gọi hàm update (Lưu ý: Backend PUT multipart có thể kén, nên dùng POST /update/{id} nếu cần thiết, nhưng ở đây ta dùng PUT theo chuẩn REST)
            await RadioService.update(id, data);
            
            alert("✅ Cập nhật thành công!");
            navigate('/admin/radio');
        } catch (error) {
            console.error(error);
            alert("Lỗi cập nhật! Vui lòng kiểm tra lại.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button onClick={() => navigate('/admin/radio')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2 transition-colors">
                            <ArrowLeft size={20} /> Quay lại danh sách
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                <Radio size={28} />
                            </span>
                            Chỉnh sửa Bài Hát #{id}
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- CỘT TRÁI --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                                <FileAudio className="text-blue-500" size={20} /> Thông tin chi tiết
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề <span className="text-red-500">*</span></label>
                                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-lg"/>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tác giả <span className="text-red-500">*</span></label>
                                        <input type="text" name="author" required value={formData.author} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Thể loại</label>
                                        <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                            <option value="HISTORY">📜 Lịch Sử</option>
                                            <option value="LAW">⚖️ Pháp Luật</option>
                                            <option value="LOFI">🎵 Nhạc Lofi</option>
                                            <option value="SLEEP_STORY">🌙 Chuyện Đêm Khuya</option>
                                        </select>
                                    </div>
                                </div>

                                {/* MEDIA SELECTION (Update logic) */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Nguồn Âm Thanh</label>
                                    
                                    <div className="flex gap-4 mb-4">
                                        <button type="button" 
                                            onClick={() => setSourceType('LINK')}
                                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${sourceType === 'LINK' ? 'bg-white shadow text-blue-600 border border-blue-200' : 'text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            <LinkIcon size={18}/> Link Online
                                        </button>
                                        <button type="button"
                                            onClick={() => setSourceType('FILE')}
                                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${sourceType === 'FILE' ? 'bg-white shadow text-blue-600 border border-blue-200' : 'text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            <UploadCloud size={18}/> File Upload
                                        </button>
                                    </div>

                                    {sourceType === 'LINK' ? (
                                        <div className="relative">
                                            <input type="url" name="audioUrl" 
                                                value={formData.audioUrl} onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <Youtube size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"/>
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Hiển thị file hiện tại */}
                                            {formData.audioUrl && formData.audioUrl.includes('/uploads/') && !selectedFile && (
                                                <div className="mb-3 p-2 bg-green-50 text-green-700 rounded border border-green-200 text-sm flex items-center gap-2">
                                                    <FileAudio size={16}/> Đang dùng file: {formData.audioUrl.split('/').pop()}
                                                </div>
                                            )}

                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-blue-300 transition-all">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                                                    <p className="text-sm text-gray-500"><span className="font-semibold">Chọn file mới</span> để thay thế</p>
                                                </div>
                                                <input type="file" className="hidden" accept="audio/*,video/*" onChange={handleFileChange} />
                                            </label>
                                            
                                            {selectedFile && (
                                                <div className="mt-2 text-sm text-blue-600 font-medium flex items-center gap-2">
                                                    <UploadCloud size={16}/> Sẽ tải lên: {selectedFile.name}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả ngắn</label>
                                    <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                                <Activity className="text-green-600" size={20} /> Trạng thái
                            </h2>
                            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer" onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="font-medium text-gray-700">
                                    {formData.isActive ? 'Đang Công Khai' : 'Đã Ẩn'}
                                </span>
                            </div>
                        </div>

                        <div className="sticky bottom-6">
                            <button type="submit" disabled={submitting} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center gap-2 text-lg">
                                {submitting ? "Đang lưu..." : <><Save size={20} /> Lưu Thay Đổi</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RadioEdit;