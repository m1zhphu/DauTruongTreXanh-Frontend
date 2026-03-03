import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Calendar, Clock, Save, ArrowLeft, Layers, 
  Settings, Users, FileText, Lock, Activity, Zap, BookOpen, Timer
} from "lucide-react";

import httpAdmin from '../../../services/httpAdmin';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [topics, setTopics] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topicId: "",
    startTime: "",
    status: "UPCOMING",
    durationMinutes: 30,
    maxParticipants: 50,
    questionSeconds: 15,
    resultSeconds: 5,
    accessCode: "",
    lobbyOpenMinutes: 5 // Thêm trường này để đồng bộ với CreateEvent
  });

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - offsetMs);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy danh sách Topics
        const resTopics = await httpAdmin.get("/game/topics"); 
        setTopics(resTopics.data);

        // 2. Lấy chi tiết Event
        const resEvent = await httpAdmin.get(`/events/${id}`);
        const data = resEvent.data;

        setFormData({
          title: data.title,
          description: data.description || "",
          topicId: data.topic?.id || "",
          startTime: formatDateTimeLocal(data.startTime),
          status: data.status,
          durationMinutes: data.durationMinutes,
          maxParticipants: data.maxParticipants,
          questionSeconds: data.questionSeconds,
          resultSeconds: data.resultSeconds,
          accessCode: data.accessCode || "",
          lobbyOpenMinutes: data.lobbyOpenMinutes || 5
        });
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await httpAdmin.put(`/events/${id}`, {
        ...formData,
        startTime: new Date(formData.startTime).toISOString()
      });
      alert("✅ Cập nhật sự kiện thành công!");
      navigate("/admin/events");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/admin/events")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2 transition-colors"
            >
              <ArrowLeft size={20} /> Quay lại danh sách
            </button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <Settings size={28} />
              </span>
              Chỉnh sửa Sự kiện #{id}
            </h1>
            <p className="text-gray-500 mt-1 ml-14">
              Cập nhật thông tin và cấu hình cho cuộc thi.
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
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-400"/> Chủ đề thi <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="topicId"
                      required
                      value={formData.topicId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      <option value="">-- Chọn chủ đề --</option>
                      {topics.map(topic => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name} ({topic.totalKnots || 0} câu)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Activity size={16} className="text-gray-400"/> Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none font-bold ${
                        formData.status === 'LIVE' ? 'text-red-600 bg-red-50' : 
                        formData.status === 'UPCOMING' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                      }`}
                    >
                      <option value="UPCOMING">UPCOMING (Sắp diễn ra)</option>
                      <option value="LIVE">LIVE (Đang diễn ra)</option>
                      <option value="ENDED">ENDED (Đã kết thúc)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400"/> Thời gian bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mô tả / Luật chơi
                  </label>
                  <textarea
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: CẤU HÌNH (1/3) --- */}
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
                     <span className="flex items-center gap-2"><Lock size={16}/> Mã truy cập</span>
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
              </div>
            </div>

            {/* Card 3: Tốc độ game */}
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
            </div>

            {/* Submit Action */}
            <div className="sticky bottom-6">
               <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
              >
                {submitting ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Save size={20} /> Lưu Thay Đổi
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

export default EditEvent;