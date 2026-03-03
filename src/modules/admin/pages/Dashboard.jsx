import React, { useState } from "react";
import { UploadCloud, FileText, BookOpen, Users, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ✅ IMPORT FILE CẤU HÌNH CHUNG (Thay vì import từ services cũ)
// Hãy kiểm tra lại số lượng dấu chấm "../" cho đúng với thư mục của bạn
import httpAdmin from '../../../services/httpAdmin'; 

// Giả sử bạn có component StatsCard, nếu chưa có thì có thể tạo hoặc tạm thời bỏ qua import này
import StatsCard from "../components/StatsCard"; 

// Dữ liệu biểu đồ giả lập
const chartData = [
  { name: 'Thứ 2', questions: 40 }, { name: 'Thứ 3', questions: 30 }, { name: 'Thứ 4', questions: 20 },
  { name: 'Thứ 5', questions: 27 }, { name: 'Thứ 6', questions: 18 }, { name: 'Thứ 7', questions: 23 },
];

export default function Dashboard() {
    const [file, setFile] = useState(null);
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !topic) return;
        
        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('topic', topic);

        try {
            await httpAdmin.post('/questions/generate-from-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setMessage({ type: 'success', text: `✅ Thành công! Đã tạo bộ câu hỏi cho chủ đề: ${topic}` });
            setTopic(''); 
            setFile(null);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: '❌ Lỗi: ' + (error.response?.data || error.message) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Chào mừng trở lại, hôm nay bạn muốn tạo chủ đề gì?</p>
                </div>
            </div>

            {/* 1. KHU VỰC THỐNG KÊ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Tổng chủ đề" value="12" icon={<BookOpen size={24}/>} color="bg-blue-500" />
                <StatsCard title="Câu hỏi đã tạo" value="1,250" icon={<FileText size={24}/>} color="bg-green-500" />
                <StatsCard title="Lượt chơi" value="854" icon={<Users size={24}/>} color="bg-purple-500" />
                <StatsCard title="File đã xử lý" value="45" icon={<UploadCloud size={24}/>} color="bg-orange-500" />
            </div>

            {/* 2. KHU VỰC CHÍNH */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: FORM UPLOAD */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <UploadCloud className="text-blue-600" size={20}/> Tạo Câu Hỏi Từ PDF (AI)
                            </h2>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">1. Tên chủ đề</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Ví dụ: Sự tích Bánh Chưng"
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">2. File Tài Liệu (PDF)</label>
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className={`w-10 h-10 mb-3 ${file ? 'text-green-500' : 'text-gray-400 group-hover:text-blue-500'} transition-colors`} />
                                        <p className="text-sm text-gray-500">
                                            {file ? <span className="text-green-600 font-bold">{file.name}</span> : <span>Kéo thả hoặc bấm để chọn file</span>}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PDF (Max 50MB)</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
                                </label>
                            </div>

                            <button 
                                disabled={loading || !file || !topic}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin"/> : <UploadCloud size={20}/>}
                                {loading ? 'AI Đang Đọc & Xử Lý...' : 'Bắt Đầu Tạo Câu Hỏi'}
                            </button>

                            {message && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {message.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                                    {message.text}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* CỘT PHẢI: BIỂU ĐỒ */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Hoạt động tuần qua</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}}/>
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}/>
                                <Bar dataKey="questions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Box nhỏ thông báo */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
                        <h3 className="font-bold text-lg mb-1">Mẹo nhỏ 💡</h3>
                        <p className="text-sm opacity-90">Bạn có thể dùng Claude Desktop để tạo câu hỏi mà không cần vào trang web này.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}