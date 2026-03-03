import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  BookOpen,
  Save,
  ArrowLeft,
  Trophy,
  Settings,
  Users,
  Timer,
  FileText,
  Lock,
  Zap
} from "lucide-react";
import httpAdmin from "../../../services/httpAdmin"; 

const CreateEvent = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    topicId: "",
    maxParticipants: 50,
    durationMinutes: 30,
    lobbyOpenMinutes: 5,
    questionSeconds: 15,
    resultSeconds: 5,
    accessCode: "",
  });

  // 1. Lấy danh sách chủ đề để Admin chọn
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Gọi API của Admin để lấy FULL list (cả private)
        const res = await httpAdmin.get("/questions/all-topics"); 
        setTopics(res.data);
      } catch (err) {
        console.error("Lỗi tải chủ đề:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topicId) {
      alert("Vui lòng chọn chủ đề thi!");
      return;
    }

    setSubmitting(true);
    try {
      await httpAdmin.post("/events/create", {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(), // Convert ISO string
        topicId: Number(formData.topicId),
        maxParticipants: Number(formData.maxParticipants),
        durationMinutes: Number(formData.durationMinutes),
        lobbyOpenMinutes: Number(formData.lobbyOpenMinutes),
        questionSeconds: Number(formData.questionSeconds),
        resultSeconds: Number(formData.resultSeconds),
        accessCode: formData.accessCode?.trim() || null,
      });

      alert("🎉 Tạo sự kiện thành công!");
      navigate("/admin/events");
    } catch (err) {
      console.error(err);
      alert("Lỗi: " + (err.response?.data?.message || "Không thể tạo sự kiện"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2 transition-colors"
            >
              <ArrowLeft size={20} /> Quay lại danh sách
            </button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                <Trophy size={28} />
              </span>
              Tạo Sự Kiện Mới
            </h1>
            <p className="text-gray-500 mt-1 ml-14">
              Thiết lập thông tin và cấu hình cho cuộc thi trực tuyến.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- CỘT TRÁI: THÔNG TIN CHÍNH (2/3) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Thông tin chung */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                <FileText className="text-blue-500" size={20} /> Thông tin chung
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tên sự kiện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ví dụ: Thi Đình - Tuần 45 (Chủ đề Lịch Sử)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-400"/> Bộ đề thi (Topic) <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="topicId"
                      value={formData.topicId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      required
                      disabled={loading}
                    >
                      <option value="">-- Chọn chủ đề --</option>
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.totalKnots || 0} câu)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400"/> Thời gian bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mô tả / Luật chơi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Nhập luật chơi, giải thưởng hoặc ghi chú cho người tham gia..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: CẤU HÌNH GAME (1/3) --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card 2: Cấu hình phòng thi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                <Settings className="text-emerald-600" size={20} /> Cấu hình phòng thi
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center justify-between">
                    <span className="flex items-center gap-2"><Users size={16}/> Giới hạn người chơi</span>
                    <span className="text-emerald-600 font-bold">{formData.maxParticipants}</span>
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center justify-between">
                    <span className="flex items-center gap-2"><Clock size={16}/> Thời lượng (phút)</span>
                    <span className="text-emerald-600 font-bold">{formData.durationMinutes}p</span>
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    min="5"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center justify-between">
                     <span className="flex items-center gap-2"><Lock size={16}/> Mã truy cập (Option)</span>
                  </label>
                  <input
                    type="text"
                    name="accessCode"
                    value={formData.accessCode}
                    onChange={handleChange}
                    placeholder="Trống = Công khai"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-center uppercase tracking-widest"
                  />
                </div>

                 <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                    <p className="font-bold mb-1 flex items-center gap-1"><Clock size={12}/> Lưu ý:</p>
                    Phòng chờ sẽ mở trước <b>{formData.lobbyOpenMinutes} phút</b> so với giờ bắt đầu.
                 </div>
              </div>
            </div>

            {/* Card 3: Cấu hình thời gian câu hỏi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                <Zap className="text-yellow-500" size={20} /> Tốc độ game
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 text-center">Trả lời (giây)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="questionSeconds"
                      min="5"
                      value={formData.questionSeconds}
                      onChange={handleChange}
                      className="w-full px-2 py-3 text-center text-xl font-black text-slate-800 bg-slate-100 rounded-xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    />
                    <Timer size={14} className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"/>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 text-center">Đáp án (giây)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="resultSeconds"
                      min="1"
                      value={formData.resultSeconds}
                      onChange={handleChange}
                      className="w-full px-2 py-3 text-center text-xl font-black text-slate-800 bg-slate-100 rounded-xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    />
                    <Clock size={14} className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"/>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Tổng thời gian mỗi câu: <b>{Number(formData.questionSeconds) + Number(formData.resultSeconds)}s</b>
              </p>
            </div>

            {/* Submit Action */}
            <div className="sticky bottom-6">
               <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
              >
                {submitting ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    <Save size={20} /> Hoàn tất & Lên lịch
                  </>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;