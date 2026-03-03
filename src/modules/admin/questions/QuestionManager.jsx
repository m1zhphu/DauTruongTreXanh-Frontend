import React, { useState, useEffect } from 'react';
import QuestionService from '../../../services/QuestionService';
import TopicService from '../../../services/TopicService'; 
import { Search, Filter, ChevronDown, ChevronUp, Trash2, Edit, CheckCircle, RefreshCw, XCircle, Database } from 'lucide-react';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  
  const [keyword, setKeyword] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    TopicService.getAllForAdmin().then(res => setTopics(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [page, selectedTopic]); 

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const topicIdParam = selectedTopic || null;
      const res = await QuestionService.getAll(page, 10, keyword, topicIdParam);
      setQuestions(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Lỗi tải câu hỏi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchQuestions(); 
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedTopic('');
    setPage(0);
    fetchQuestionsManual('', null, 0); 
  };

  const fetchQuestionsManual = async (key, top, pg) => {
    setLoading(true);
    try {
      const res = await QuestionService.getAll(pg, 10, key, top);
      setQuestions(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    // [THAY ĐỔI]: w-full, tăng padding p-8, dùng flex-col để chiếm hết chiều cao
    <div className="w-full min-h-screen bg-gray-50 p-8 flex flex-col font-sans">
      
      {/* HEADER: To hơn, đậm hơn */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Database size={36} className="text-blue-600" />
            Ngân Hàng Câu Hỏi
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Quản lý và tra cứu toàn bộ câu hỏi trong hệ thống.</p>
        </div>
        <div className="text-base text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          Tổng số trang: <span className="font-bold text-blue-700 text-lg ml-1">{totalPages}</span>
        </div>
      </div>

      {/* --- TOOLBAR (SEARCH & FILTER): Input to hơn --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col xl:flex-row gap-5 items-center justify-between">
        
        <form onSubmit={handleSearch} className="flex flex-1 gap-5 w-full">
          {/* Ô Tìm kiếm */}
          <div className="relative flex-1">
            <Search className="absolute left-5 top-4 text-gray-400" size={22} />
            <input 
              type="text" 
              className="w-full pl-14 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-gray-700 text-base"
              placeholder="Nhập nội dung cần tìm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword && (
              <button 
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            )}
          </div>

          {/* Dropdown Chủ đề */}
          <div className="relative w-1/3 min-w-[250px]">
            <Filter className="absolute left-5 top-4 text-gray-400" size={22} />
            <select 
              className="w-full pl-14 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-gray-700 text-base"
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setPage(0); }}
            >
              <option value="">-- Tất cả chủ đề --</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-4 text-gray-400 pointer-events-none" size={20} />
          </div>

          {/* Nút Tìm kiếm */}
          <button type="submit" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 text-base">
            <Search size={22} />
            Tìm Kiếm
          </button>
        </form>

        {/* Nút Reset */}
        <button 
          onClick={handleReset} 
          className="px-6 py-3.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2 text-base shadow-sm"
          title="Làm mới bộ lọc"
        >
          <RefreshCw size={22} />
          <span className="hidden xl:inline">Làm mới</span>
        </button>
      </div>

      {/* --- DATA TABLE: Table rộng, cell to --- */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100/80 text-gray-500 uppercase text-sm font-bold tracking-wider border-b border-gray-200">
            <tr>
              <th className="p-6 w-24 text-center">ID</th>
              <th className="p-6">Nội dung câu hỏi</th>
              <th className="p-6 w-1/4">Chủ đề</th>
              <th className="p-6 w-28 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="p-16 text-center text-gray-500 italic text-lg">Đang tải dữ liệu...</td></tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-20 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-4">
                    <Search size={64} className="opacity-20" />
                    <span className="text-xl font-medium">Không tìm thấy câu hỏi nào phù hợp.</span>
                    <button onClick={handleReset} className="text-blue-600 hover:underline text-base font-semibold">Xóa bộ lọc để thử lại</button>
                  </div>
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <React.Fragment key={q.id}>
                  {/* MAIN ROW */}
                  <tr 
                    className={`transition-colors cursor-pointer border-l-4 ${expandedRow === q.id ? 'bg-blue-50/60 border-blue-600' : 'bg-white border-transparent hover:bg-gray-50'}`} 
                    onClick={() => toggleExpand(q.id)}
                  >
                    <td className="p-6 text-center font-mono text-gray-400 text-base">#{q.id}</td>
                    <td className="p-6">
                      <div className="font-medium text-gray-800 text-lg line-clamp-1">{q.content}</div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        {q.topicName || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className={`p-2.5 rounded-full inline-flex transition-transform duration-300 ${expandedRow === q.id ? 'bg-blue-100 text-blue-700 rotate-180' : 'text-gray-400 hover:bg-gray-200'}`}>
                        <ChevronDown size={24} />
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED ROW DETAILS */}
                  {expandedRow === q.id && (
                    <tr className="bg-blue-50/40 animate-fade-in">
                      <td colSpan="4" className="p-10 border-b border-blue-100">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                          
                          {/* Left Column: Content */}
                          <div className="xl:col-span-7 space-y-8">
                            <div>
                              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Câu hỏi đầy đủ
                              </h4>
                              <div className="text-gray-900 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-xl leading-relaxed font-medium">
                                {q.content}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Giải thích đáp án
                              </h4>
                              <div className="text-gray-700 bg-yellow-50/80 p-5 rounded-2xl border border-yellow-200 italic flex gap-4 items-start">
                                <span className="text-2xl mt-1">💡</span>
                                <p className="text-lg leading-relaxed">{q.explanation || "Không có giải thích chi tiết cho câu hỏi này."}</p>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Options & Actions */}
                          <div className="xl:col-span-5 flex flex-col h-full">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Các lựa chọn
                            </h4>
                            <ul className="space-y-4 flex-1">
                              {q.options && q.options.map((opt, idx) => {
                                const isCorrect = opt === q.correctAnswer;
                                return (
                                  <li key={idx} className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${isCorrect ? 'bg-green-50 border-green-300 shadow-sm scale-[1.02]' : 'bg-white border-gray-200 opacity-90'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isCorrect ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-600'}`}>
                                      {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className={`flex-1 text-lg ${isCorrect ? 'text-green-800 font-bold' : 'text-gray-700'}`}>{opt}</span>
                                    {isCorrect && <CheckCircle size={28} className="text-green-600 shrink-0" />}
                                  </li>
                                );
                              })}
                            </ul>
                            
                            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-blue-200/50">
                                <button className="flex items-center gap-2 text-gray-700 bg-white border border-gray-300 px-6 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-bold text-base transition shadow-sm">
                                    <Edit size={18} /> Chỉnh sửa
                                </button>
                                <button className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-6 py-2.5 rounded-xl hover:bg-red-100 hover:border-red-300 font-bold text-base transition shadow-sm">
                                    <Trash2 size={18} /> Xóa câu hỏi
                                </button>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION --- */}
      <div className="flex justify-between items-center mt-8">
        <span className="text-gray-600 text-base font-medium bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm">
          Trang <span className="font-bold text-gray-900">{page + 1}</span> / {totalPages > 0 ? totalPages : 1}
        </span>
        <div className="flex gap-3">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95 text-base"
          >
            ← Trước
          </button>
          <button 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95 text-base"
          >
            Sau →
          </button>
        </div>
      </div>

    </div>
  );
};

export default QuestionManager;