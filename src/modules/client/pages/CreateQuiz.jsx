import React, { useState, useRef } from "react";
import { Plus, Trash, Image as ImageIcon, Save, CheckCircle, ArrowLeft, Clock, Layout, Type, FileText, Upload, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import httpAxios from "../../../services/httpAxios";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Trạng thái upload ảnh

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    coverImage: "",
    questions: [
      { content: "", imageUrl: "", timeLimit: 15, options: ["", "", "", ""], correctAnswer: "" }
    ]
  });

  // Refs
  const coverInputRef = useRef(null);
  const questionImageRefs = useRef([]);

  // --- LOGIC HELPER ---
  
  // 1. Hàm Upload ảnh lên Server
  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        setUploading(true);
        // Gọi API Backend đã tạo ở Bước 1
        const res = await httpAxios.post("/upload/image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data.url; // Trả về URL từ server (ví dụ: http://localhost:8080/api/upload/files/abc.jpg)
    } catch (err) {
        alert("Lỗi upload ảnh: " + err.message);
        return null;
    } finally {
        setUploading(false);
    }
  };

  // 2. Xử lý khi người dùng chọn ảnh
  const handleImageUpload = async (e, type, index = null) => {
      const file = e.target.files[0];
      if (!file) return;

      // Upload lên server
      const imageUrl = await uploadImageToServer(file);
      
      if (!imageUrl) return; // Nếu lỗi thì dừng

      if (type === 'cover') {
          setQuizData(prev => ({ ...prev, coverImage: imageUrl }));
      } else if (type === 'question' && index !== null) {
          updateQuestion(index, 'imageUrl', imageUrl);
      }
  };

  // --- CRUD LOGIC ---
  const handleAddQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { content: "", imageUrl: "", timeLimit: 15, options: ["", "", "", ""], correctAnswer: "" }]
    });
  };

  const handleRemoveQuestion = (index) => {
    if (quizData.questions.length === 1) return alert("Cần ít nhất 1 câu hỏi!");
    const newQ = [...quizData.questions];
    newQ.splice(index, 1);
    setQuizData({ ...quizData, questions: newQ });
  };

  const updateQuestion = (index, field, value) => {
    setQuizData(prev => {
        const newQuestions = [...prev.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        return { ...prev, questions: newQuestions };
    });
  };

  const updateOption = (qIndex, oIndex, value) => {
    setQuizData(prev => {
        const newQuestions = [...prev.questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex].options = newOptions;
        
        // Nếu sửa đáp án đúng, update theo
        if (newQuestions[qIndex].correctAnswer === prev.questions[qIndex].options[oIndex]) {
            newQuestions[qIndex].correctAnswer = value;
        }
        return { ...prev, questions: newQuestions };
    });
  };

  const setCorrect = (qIndex, optionValue) => {
    if (!optionValue) return alert("Hãy nhập nội dung đáp án trước!");
    updateQuestion(qIndex, "correctAnswer", optionValue);
  };

  const handleSubmit = async () => {
    if (!quizData.title) return alert("Vui lòng nhập tên bài kiểm tra!");
    if (uploading) return alert("Đang upload ảnh, vui lòng chờ...");

    try {
      setLoading(true);
      await httpAxios.post("/live-quiz/create", quizData);
      alert("Tạo bài thi thành công!");
      navigate("/my-quizzes"); 
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const optionConfig = [
      { color: "bg-red-500", border: "border-red-500", icon: "▲" },
      { color: "bg-blue-500", border: "border-blue-500", icon: "◆" },
      { color: "bg-yellow-500", border: "border-yellow-500", icon: "●" },
      { color: "bg-green-500", border: "border-green-500", icon: "■" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans pb-20 selection:bg-slate-900 selection:text-white">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                      <ArrowLeft size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
                      <span className="font-bold text-slate-700 hidden sm:block">Quiz Creator</span>
                  </div>
              </div>

              <div className="flex items-center gap-3">
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading || uploading}
                    className="bg-slate-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
                    {loading ? "Đang lưu..." : "Lưu bài thi"}
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <FileText size={14} /> Thông tin chung
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Tiêu đề Quiz</label>
                            <input 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 outline-none transition-all text-sm font-semibold text-slate-700 placeholder:font-normal" 
                                placeholder="Nhập tên bài kiểm tra..."
                                value={quizData.title || "" }
                                onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Mô tả</label>
                            <textarea 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 outline-none transition-all resize-none text-sm h-24 placeholder:text-slate-400"
                                placeholder="Mô tả ngắn gọn..."
                                value={quizData.description || "" }
                                onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Ảnh bìa</label>
                            <div 
                                onClick={() => !uploading && coverInputRef.current.click()}
                                className={`group w-full h-40 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 cursor-pointer transition-all overflow-hidden relative ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {quizData.coverImage ? (
                                    <>
                                        <img src={quizData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-bold flex gap-1"><Upload size={14}/> Thay ảnh</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <ImageIcon size={20} className="mb-2"/>
                                        <span className="text-xs">Tải ảnh lên</span>
                                    </div>
                                )}
                                {uploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-slate-500"/></div>}
                            </div>
                            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} disabled={uploading}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-9 space-y-6">
                
                {quizData.questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:border-slate-300 transition-all">
                        {/* Toolbar */}
                        <div className="bg-white px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">
                                    Câu {qIdx + 1}
                                </span>
                                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                    <Clock size={12} className="text-slate-400" />
                                    <select 
                                        className="bg-transparent text-xs font-semibold text-slate-600 outline-none cursor-pointer"
                                        value={q.timeLimit}
                                        onChange={(e) => updateQuestion(qIdx, "timeLimit", parseInt(e.target.value))}
                                    >
                                        {[10, 15, 20, 30, 45, 60, 90, 120].map(t => <option key={t} value={t}>{t} giây</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleRemoveQuestion(qIdx)}
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                            >
                                <Trash size={16} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <div className="flex-1">
                                    <div className="relative h-full">
                                        <Type size={16} className="absolute left-3 top-3 text-slate-300" />
                                        <textarea 
                                            className="w-full h-full pl-9 p-3 text-base font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 outline-none resize-none transition-all placeholder:text-slate-400 min-h-[120px]"
                                            placeholder="Nhập nội dung câu hỏi..."
                                            value={q.content}
                                            onChange={(e) => updateQuestion(qIdx, "content", e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                {/* Question Media Box */}
                                <div 
                                    onClick={() => !uploading && questionImageRefs.current[qIdx]?.click()}
                                    className={`w-full md:w-64 h-[120px] bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all relative overflow-hidden group/media ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {q.imageUrl ? (
                                        <>
                                            <img src={q.imageUrl} alt="Question" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity text-white">
                                                <Upload size={20} className="mb-1"/>
                                                <span className="text-xs font-bold">Thay ảnh</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon size={24} className="mb-1 opacity-50"/>
                                            <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">Thêm ảnh</span>
                                        </>
                                    )}
                                    {uploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-slate-500"/></div>}
                                    
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        ref={(el) => (questionImageRefs.current[qIdx] = el)}
                                        onChange={(e) => handleImageUpload(e, 'question', qIdx)}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oIdx) => {
                                    const style = optionConfig[oIdx];
                                    const isCorrect = q.correctAnswer === opt && opt !== "";
                                    
                                    return (
                                        <div key={oIdx} className="flex items-center gap-0">
                                            <div className={`w-1.5 self-stretch rounded-l-md ${style.color}`}></div>
                                            <div className="flex-1 relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                                                    Đáp án {style.icon}
                                                </div>
                                                <input 
                                                    className={`w-full pl-16 pr-10 py-3 border rounded-r-md outline-none transition-all text-sm font-medium ${
                                                        isCorrect 
                                                        ? `bg-green-50 border-green-500 text-green-800` 
                                                        : `bg-white border-slate-200 focus:border-slate-400`
                                                    }`}
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => setCorrect(qIdx, opt)}
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
                                                        isCorrect 
                                                        ? "text-green-600 bg-white shadow-sm" 
                                                        : "text-slate-300 hover:text-slate-500"
                                                    }`}
                                                >
                                                    <CheckCircle size={18} weight={isCorrect ? "fill" : "regular"} fill={isCorrect ? "currentColor" : "none"}/>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                <button 
                    onClick={handleAddQuestion}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 hover:bg-white transition-all flex flex-col items-center justify-center gap-1 group bg-slate-50/50"
                >
                    <Plus size={20} className="group-hover:scale-110 transition-transform"/>
                    <span className="font-bold text-xs uppercase tracking-wide">Thêm câu hỏi</span>
                </button>

            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;