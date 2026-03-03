import React, { useEffect, useState } from "react";
import { Play, Plus, Clock, HelpCircle, Trash2, Search, FileQuestion, ArrowLeft, LayoutGrid, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import httpAxios from "../../../services/httpAxios";

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMyQuizzes();
  }, []);

  const fetchMyQuizzes = async () => {
    try {
      const res = await httpAxios.get("/live-quiz/my-list");
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHostGame = async (quizId) => {
    try {
      const res = await httpAxios.post(`/live-quiz/host/${quizId}`);
      const { roomCode } = res.data;
      navigate(`/quiz/${roomCode}`, { state: { isHost: true } });
    } catch (err) {
      alert("Lỗi khi tạo phòng: " + (err.response?.data?.message || err.message));
    }
  };

  // --- HÀM XỬ LÝ SỬA QUIZ ---
  const handleEditQuiz = (quizId) => {
    // Chuyển hướng đến trang tạo quiz nhưng kèm ID để biết là đang sửa
    navigate(`/edit-quiz/${quizId}`);
  };

  // --- HÀM XỬ LÝ XÓA QUIZ ---
  const handleDeleteQuiz = async (quizId) => {
      if(!window.confirm("Bạn có chắc chắn muốn xóa bài Quiz này không?")) return;
      
      try {
          await httpAxios.delete(`/live-quiz/${quizId}`);
          // Cập nhật lại danh sách sau khi xóa
          setQuizzes(prev => prev.filter(q => q.id !== quizId));
      } catch (err) {
          alert("Lỗi khi xóa: " + (err.response?.data?.message || err.message));
      }
  }

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-slate-800 font-sans pb-20 relative selection:bg-black selection:text-white">
      
      {/* --- MODERN GRID BACKGROUND (FIXED) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(to right, #e5e7eb 1px, transparent 1px)`,
             backgroundSize: '48px 48px',
             opacity: 0.6
           }}>
      </div>
      
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white via-transparent to-transparent z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-8">
        
        {/* 1. BACK BUTTON ROW */}
        <div className="mb-6">
            <button 
              onClick={() => navigate('/')} 
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <div className="p-1.5 bg-white rounded-full border border-slate-200 shadow-sm group-hover:border-slate-300 transition-all">
                  <ArrowLeft size={16} />
              </div>
              Quay lại trang chủ
            </button>
        </div>

        {/* 2. HEADER SECTION (TITLE + ACTIONS) */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-slate-200 pb-8">
          
          {/* Left: Title & Icon */}
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center shadow-md">
                    <FileQuestion size={20} />
                </div>
                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">Quiz Manager</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Thư viện của tôi
            </h1>
            <p className="mt-2 text-slate-500 text-lg">
              Quản lý danh sách câu hỏi và tổ chức phòng thi đấu.
            </p>
          </div>

          {/* Right: Search & Create Button (Grouped) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
             
             {/* Search Bar (Nằm bên trái) */}
             <div className="relative group w-full sm:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
                 <input 
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all text-sm shadow-sm"
                 />
             </div>

            {/* Create Button (Nằm bên phải) */}
            <button 
              onClick={() => navigate("/create-quiz")}
              className="w-full sm:w-auto bg-black hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap active:scale-[0.98]"
            >
              <Plus size={18} /> Tạo Quiz Mới
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-slate-200 border-t-black"></div>
            <p className="mt-4 text-slate-400 font-medium text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
               <LayoutGrid size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Chưa có bài Quiz nào</h3>
            <p className="text-slate-500 mt-1 mb-6">Hãy bắt đầu hành trình bằng cách tạo bài đầu tiên.</p>
            <button 
              onClick={() => navigate("/create-quiz")}
              className="text-slate-900 font-bold hover:underline underline-offset-4 text-sm"
            >
              Tạo ngay bây giờ &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 overflow-hidden"
              >
                {/* Minimalist Cover Area */}
                <div className="h-32 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                    {/* Abstract Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" 
                         style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
                    </div>
                    
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 z-10 group-hover:scale-110 transition-transform duration-300">
                       <FileQuestion size={24} />
                    </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">
                      {quiz.description || "Không có mô tả thêm."}
                  </p>
                  
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold uppercase tracking-wide mt-auto mb-6">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <HelpCircle size={12}/> {quiz.questions?.length || 0} câu
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={12}/> {new Date(quiz.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button 
                        onClick={() => handleHostGame(quiz.id)}
                        className="flex-1 bg-black hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-200 active:scale-[0.98]"
                    >
                        <Play size={14} fill="currentColor" /> Tổ chức
                    </button>
                    {/* Nút Sửa */}
                    <button 
                        onClick={() => handleEditQuiz(quiz.id)}
                        className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-colors"
                        title="Chỉnh sửa nội dung"
                    >
                        <Edit3 size={16} />
                    </button>

                    {/* Nút Xóa */}
                    <button 
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-500 transition-colors"
                        title="Xóa bài Quiz"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;