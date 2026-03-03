import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopicService from "../../../services/TopicService";
import { PlusCircle, Search, BookOpen, Edit, Trash2, Eye, EyeOff, Lock, Clock, Calendar, HelpCircle } from "lucide-react";

export default function TopicList() {
    const [topics, setTopics] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchTopics = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("📡 Đang gọi API lấy danh sách...");
            const res = await TopicService.getAllForAdmin();
            console.log("✅ Dữ liệu nhận được:", res.data);
            setTopics(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("❌ Lỗi Fetch Topic:", err);
            setError("Không thể kết nối đến máy chủ. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const filteredTopics = topics.filter(topic => 
        topic.name.toLowerCase().includes(keyword.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa chủ đề này?")) return;
        try {
            await TopicService.remove(id);
            fetchTopics(); 
        } catch (err) {
            console.error("Lỗi xóa:", err);
            alert("Không thể xóa chủ đề này!");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await TopicService.updateStatus(id, !currentStatus);
            fetchTopics();
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
        }
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "Không giới hạn";
        const date = new Date(timeStr);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-screen">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <BookOpen className="text-blue-600" size={32} />
                        Quản Lý Chủ Đề
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Danh sách các bộ câu hỏi và bài thi trong hệ thống.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm chủ đề..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    
                    <button
                        onClick={() => navigate("/admin/add-topic")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                        <PlusCircle size={20} />
                        Thêm Mới
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-100 flex items-center gap-2">
                    ⚠️ {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider w-16 text-center">ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">Thông tin bài thi</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/5">Bảo mật</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/5">Thời gian</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Số câu hỏi</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Trạng thái</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-12 text-center text-gray-500">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mb-2"></div>
                                    <p>Đang tải dữ liệu...</p>
                                </td>
                            </tr>
                        ) : filteredTopics.length > 0 ? (
                            filteredTopics.map((topic) => (
                                <tr key={topic.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="p-4 text-center text-gray-500 font-mono text-sm">#{topic.id}</td>
                                    
                                    {/* Cột 1: Thông tin cơ bản */}
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-gray-800 text-base mb-1">{topic.name}</div>
                                        <div className="text-sm text-gray-500 line-clamp-1">{topic.description || "Không có mô tả"}</div>
                                    </td>

                                    {/* Cột 2: Bảo mật */}
                                    <td className="p-4 align-top">
                                        {topic.public ? ( // Lưu ý: Backend trả về 'public' (do JPA), kiểm tra log nếu là 'isPublic'
                                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                                <Eye size={16} /> Công khai
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-orange-600 text-sm font-bold">
                                                    <Lock size={16} /> Riêng tư
                                                </div>
                                                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded border border-gray-200">
                                                    <div>Mã: <span className="font-mono font-bold text-gray-800">{topic.accessCode || "---"}</span></div>
                                                    <div>Pass: <span className="font-mono font-bold text-gray-800">{topic.password || "---"}</span></div>
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    {/* Cột 3: Thời gian */}
                                    <td className="p-4 align-top">
                                        <div className="text-sm text-gray-600 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-green-500" />
                                                <span className="text-xs">Mở: {formatTime(topic.startTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-red-500" />
                                                <span className="text-xs">Đóng: {formatTime(topic.endTime)}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Cột 4: Số câu hỏi (ĐÃ SỬA & TĂNG KÍCH THƯỚC) */}
                                    <td className="p-4 text-center align-middle">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                                            <HelpCircle size={16} />
                                            {/* Sửa từ questionCount -> totalKnots */}
                                            {topic.totalKnots || 0} câu
                                        </span>
                                    </td>

                                    {/* Cột 5: Trạng thái */}
                                    <td className="p-4 text-center align-middle">
                                        <button 
                                            onClick={() => handleToggleStatus(topic.id, topic.status)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                                topic.status 
                                                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                        >
                                            {topic.status ? "Hoạt động" : "Đã ẩn"}
                                        </button>
                                    </td>

                                    {/* Cột 6: Thao tác */}
                                    <td className="p-4 text-center align-middle">
                                        <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => navigate(`/admin/edit-topic/${topic.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(topic.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-12 text-center text-gray-400">
                                    <div className="mb-2 text-4xl">📭</div>
                                    <p>Không tìm thấy chủ đề nào.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}