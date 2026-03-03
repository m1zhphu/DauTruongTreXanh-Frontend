import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopicService from "../../../services/TopicService"; 
import { ArrowLeft, Loader2, UploadCloud, FileText } from "lucide-react";
// Đã xóa import axios vì không cần thiết nữa

export default function AddTopic() {
    const [topic, setTopic] = useState({
        name: "",
        description: "",
        status: true,
        totalKnots: 100 
    });

    const [file, setFile] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" }); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTopic(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            setFile(null);
            if (e.target.files.length > 0) {
                alert("Vui lòng chọn file định dạng PDF!");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!topic.name.trim()) { alert("Tên chủ đề không được để trống!"); return; }

        setIsSubmitting(true);
        setMessage({ text: "Đang xử lý...", type: "loading" });

        try {
            if (file) {
                // TRƯỜNG HỢP 1: CÓ FILE PDF -> Gọi qua Service để fix lỗi 403
                setMessage({ text: "Đang upload file và tạo chủ đề...", type: "loading" });
                
                const formData = new FormData();
                formData.append('file', file);
                formData.append('name', topic.name); 
                formData.append('description', topic.description);
                formData.append('totalKnots', topic.totalKnots);
                formData.append('status', topic.status);

                // SỬA: Gọi hàm từ Service thay vì axios trực tiếp
                await TopicService.createTopicOnly(formData);

            } else {
                // TRƯỜNG HỢP 2: TẠO THỦ CÔNG
                setMessage({ text: "Đang lưu chủ đề...", type: "loading" });
                
                // SỬA: Đã có hàm create trong TopicService.js
                await TopicService.create(topic);
            }

            setMessage({ text: "🎉 Tạo chủ đề thành công!", type: "success" });
            setTimeout(() => navigate("/admin/topics"), 1500);

        } catch (err) {
            console.error("Lỗi:", err);
            // Lấy thông báo lỗi chi tiết từ backend nếu có
            const errorMsg = err.response?.data?.message || err.response?.data || err.message;
            setMessage({ 
                text: "❌ Thất bại: " + errorMsg, 
                type: "error" 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Tạo chủ đề mới</h1>
                    <p className="text-gray-500 mt-1">Thêm chủ đề thủ công hoặc dùng AI tạo từ PDF.</p>
                </div>
                <button
                    onClick={() => navigate("/admin/topics")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 font-medium border ${
                    message.type === 'success' ? "bg-green-50 text-green-800 border-green-200" 
                    : message.type === 'error' ? "bg-red-50 text-red-800 border-red-200"
                    : "bg-blue-50 text-blue-800 border-blue-200"
                }`}>
                    {message.type === 'loading' && <Loader2 size={20} className="animate-spin" />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-100">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên chủ đề <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="name" 
                                value={topic.name} 
                                onChange={handleChange} 
                                placeholder="VD: Truyền thuyết Thánh Gióng"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả ngắn</label>
                            <textarea 
                                name="description" 
                                value={topic.description} 
                                onChange={handleChange} 
                                placeholder="Mô tả nội dung chính của chủ đề này..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none min-h-[120px]" 
                            />
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-blue-800 mb-1">Số đốt tre (Mục tiêu)</label>
                                <p className="text-xs text-blue-600">Số câu hỏi cần trả lời đúng để thắng.</p>
                            </div>
                            <input 
                                type="number" 
                                name="totalKnots" 
                                value={topic.totalKnots} 
                                onChange={handleChange} 
                                className="w-24 border border-blue-300 rounded-lg p-2 text-center font-bold text-blue-800 focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                    </div>

                    {/* CỘT PHẢI: TÍNH NĂNG AI & TRẠNG THÁI */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Box Upload PDF */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-md border border-indigo-100">
                            <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                <FileText size={20} /> AI Generator
                            </h3>
                            <p className="text-sm text-indigo-600 mb-4">Upload PDF để tạo câu hỏi tự động.</p>
                            
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-indigo-50 transition">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className={`w-8 h-8 mb-2 ${file ? 'text-green-500' : 'text-indigo-400'}`} />
                                    <p className="text-sm text-gray-500 text-center px-2 truncate w-full">
                                        {file ? file.name : "Bấm để chọn PDF"}
                                    </p>
                                </div>
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            </label>
                            {file && (
                                <button 
                                    type="button" 
                                    onClick={() => setFile(null)} 
                                    className="mt-2 text-xs text-red-500 hover:underline w-full text-center"
                                >
                                    Xóa file đã chọn
                                </button>
                            )}
                        </div>

                        {/* Box Trạng thái */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Trạng thái hiển thị</label>
                            <div className="flex items-center justify-between">
                                <span className={`font-bold ${topic.status ? 'text-green-600' : 'text-gray-500'}`}>
                                    {topic.status ? 'Đang hoạt động' : 'Tạm khóa'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="status" className="sr-only peer" checked={topic.status} onChange={handleChange} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Nút Submit lớn */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang xử lý...' : (file ? '🚀 TẠO BẰNG AI' : '💾 LƯU THỦ CÔNG')}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}