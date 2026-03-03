import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Trophy, ArrowRight, Users, Zap, CheckCircle2, AlertCircle, Timer, Grid3X3, ArrowLeft } from "lucide-react";
import httpAxios from "../../../services/httpAxios";


const ClientEventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await httpAxios.get("/events/public-list");
        setEvents(res.data || []);
      } catch (err) {
        console.error("Lỗi tải danh sách sự kiện:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Logic lọc sự kiện
  const filteredEvents = events.filter((event) => {
    if (filter === "ALL") return true;
    return event.status === filter;
  });

  // Cấu hình hiển thị theo trạng thái (Phong cách Minimalist)
  const getStatusInfo = (status) => {
    switch (status) {
      case "LIVE":
        return { 
            badgeBg: "bg-red-50",
            badgeText: "text-red-600",
            borderColor: "border-red-200",
            icon: <Zap size={14} className="fill-current" />,
            label: "Đang diễn ra"
        };
      case "UPCOMING":
        return { 
            badgeBg: "bg-blue-50",
            badgeText: "text-blue-600",
            borderColor: "border-blue-200",
            icon: <Calendar size={14} />,
            label: "Sắp diễn ra"
        };
      case "ENDED":
        return { 
            badgeBg: "bg-slate-100",
            badgeText: "text-slate-500",
            borderColor: "border-slate-200",
            icon: <CheckCircle2 size={14} />,
            label: "Đã kết thúc"
        };
      default:
        return { badgeBg: "bg-gray-100", badgeText: "text-gray-500", borderColor: "border-gray-200", icon: null, label: status };
    }
  };

  // Thứ tự Tabs: Tất cả -> Sắp tới -> Đang diễn ra -> Đã kết thúc
  const tabs = [
    { id: "ALL", label: "Tất cả" },
    { id: "UPCOMING", label: "Sắp tới" },
    { id: "LIVE", label: "Đang diễn ra" },
    { id: "ENDED", label: "Đã kết thúc" },
  ];

  return (
    // min-h-screen đảm bảo chiều cao tối thiểu, pb-20 để chừa khoảng trống dưới cùng khi cuộn
    <div className="min-h-screen w-full bg-[#FAFAFA] text-slate-800 font-sans pb-20 relative selection:bg-black selection:text-white">
      
      {/* --- MODERN GRID BACKGROUND (FIXED) --- */}
      {/* Lớp nền lưới cố định, nội dung sẽ cuộn trượt lên trên */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(to right, #e5e7eb 1px, transparent 1px)`,
             backgroundSize: '48px 48px',
             opacity: 0.6
           }}>
      </div>
      
      {/* Gradient mờ rất nhẹ ở góc để bớt đơn điệu nhưng không lòe loẹt */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white via-transparent to-transparent z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-12">
        
        {/* Header Section: Clean & Bold Typography */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-16 border-b border-slate-200 pb-8">
          {/* CỘT TRÁI: TIÊU ĐỀ & MÔ TẢ */}
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
                    <Trophy size={20} />
                </div>
                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">Event Arena</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Đấu Trường Sự Kiện
            </h1>
            <p className="mt-3 text-slate-500 max-w-lg text-lg">
              Tham gia tranh tài, khẳng định bản lĩnh và vinh danh trên bảng xếp hạng.
            </p>
          </div>

          {/* CỘT PHẢI: ACTIONS (NÚT BACK & TABS) */}
          <div className="flex flex-col md:items-end justify-between gap-6">
              {/* Nút quay về trang chủ (Góc trên phải) */}
              <button 
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium group text-sm self-start md:self-end"
              >
                  <div className="p-1.5 bg-white rounded-full border border-slate-200 shadow-sm group-hover:border-slate-300 group-hover:shadow-md transition-all">
                      <ArrowLeft size={16} />
                  </div>
                  <span>Về trang chủ</span>
              </button>

              {/* Filter Tabs - Style: Segmented Control */}
              <div className="bg-slate-100 p-1.5 rounded-xl inline-flex flex-wrap shadow-inner">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      filter === tab.id
                        ? "bg-white text-black shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-slate-200 border-t-black"></div>
            <p className="mt-4 text-slate-400 font-medium text-sm">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
                <Grid3X3 size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Chưa có sự kiện nào</h3>
            <p className="text-slate-500">Danh mục này hiện đang trống.</p>
          </div>
        )}

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const startDate = new Date(event.startTime);
            const statusInfo = getStatusInfo(event.status);
            const isEnded = event.status === "ENDED";
            const isLive = event.status === "LIVE";

            return (
              <div 
                key={event.id}
                className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 ${
                    isLive ? "border-red-200 ring-4 ring-red-50/50" : "border-slate-200"
                }`}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeBg} ${statusInfo.badgeText} ${statusInfo.borderColor}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                    {isLive && (
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                  </div>
                  
                  {/* Topic */}
                  {event.topic && (
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                       {event.topic.name}
                    </p>
                  )}
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                </div>

                {/* Card Body Info */}
                <div className="p-6 flex-1 space-y-5">
                    {/* Time */}
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-slate-50 text-slate-500 shrink-0 border border-slate-100">
                            <Timer size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase">Bắt đầu</p>
                            <p className="text-sm font-bold text-slate-700">
                                {startDate.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                                <span className="mx-1 font-normal text-slate-300">|</span>
                                {startDate.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase mb-1 flex items-center gap-1">
                                <Clock size={12} /> Thời lượng
                            </p>
                            <p className="text-sm font-bold text-slate-700">{event.durationMinutes} phút</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase mb-1 flex items-center gap-1">
                                <Users size={12} /> Tham gia
                            </p>
                            <p className="text-sm font-bold text-slate-700">{event.currentParticipants || 0}/{event.maxParticipants}</p>
                        </div>
                    </div>

                    {/* Winner Section (If Ended) */}
                    {isEnded && event.winner && (
                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-amber-900 shrink-0">
                                <Trophy size={14} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-amber-600 font-bold uppercase">Quán quân</p>
                                <p className="text-slate-800 font-bold text-xs truncate">{event.winner.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0 mt-auto">
                    {isEnded ? (
                        <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 text-sm font-semibold cursor-not-allowed">
                            Sự kiện đã đóng
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate(`/live-battle/${event.id}`)}
                            className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                                isLive
                                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                                    : "bg-black hover:bg-slate-800 text-white shadow-lg shadow-slate-200"
                            }`}
                        >
                            {isLive ? "THAM GIA NGAY" : "VÀO PHÒNG CHỜ"} <ArrowRight size={16} />
                        </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientEventList;