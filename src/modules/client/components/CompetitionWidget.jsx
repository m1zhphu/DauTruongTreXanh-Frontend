import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, X, Clock, ArrowRight, Calendar } from "lucide-react";
import { Motion, AnimatePresence } from "framer-motion";

import httpAxios from '../config/httpAxios';
const CompetitionWidget = () => {
  const navigate = useNavigate();
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await httpAxios.get("/events/upcoming");
        // Nếu backend trả 204 thì axios sẽ vào catch? (tùy) -> cứ check data chắc ăn
        if (!res.data) {
          setUpcomingEvent(null);
          return;
        }
        setUpcomingEvent(res.data);
      } catch (err) {
        // Nếu không có event, backend thường trả 204. Không spam lỗi.
        // Chỉ log khi là lỗi khác 204/404
        const status = err?.response?.status;
        if (status && status !== 204 && status !== 404) {
          console.log("Lỗi fetch upcoming event:", err);
        }
        setUpcomingEvent(null);
      }
    };

    fetchEvent();
    const interval = setInterval(fetchEvent, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!upcomingEvent) return;

    const timer = setInterval(() => {
      const now = new Date();
      const start = new Date(upcomingEvent.startTime);
      const diff = start - now;

      if (diff <= 0) {
        if (diff > -3600000) {
          setIsLive(true);
          setTimeLeft("ĐANG DIỄN RA");
        } else {
          setUpcomingEvent(null);
        }
        return;
      }

      setIsLive(false);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (days > 0) setTimeLeft(`${days} ngày ${hours}h`);
      else setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingEvent]);

  if (!upcomingEvent) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl border-2 border-amber-200 w-80 overflow-hidden"
          >
            <div className={`p-4 text-white relative overflow-hidden ${isLive ? "bg-red-600 animate-pulse" : "bg-gradient-to-r from-amber-500 to-orange-600"}`}>
              <button onClick={() => setIsExpanded(false)} className="absolute top-2 right-2 text-white/80 hover:text-white">
                <X size={18} />
              </button>
              <div className="flex items-center gap-2 mb-1 relative z-10">
                <Trophy size={20} className="text-yellow-200" />
                <span className="font-bold uppercase tracking-wider text-xs">
                  {isLive ? "TRỰC TIẾP" : "SỰ KIỆN SẮP TỚI"}
                </span>
              </div>
              <h3 className="font-bold text-lg leading-tight relative z-10">{upcomingEvent.title}</h3>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4 bg-amber-50 p-3 rounded-xl border border-amber-100">
                <div className="text-amber-700 font-bold text-sm flex items-center gap-2">
                  {isLive ? <Trophy size={16} /> : <Clock size={16} />}
                  {isLive ? "Trạng thái:" : "Bắt đầu sau:"}
                </div>
                <div className="font-mono font-black text-amber-600 text-lg tracking-tight">{timeLeft}</div>
              </div>

              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                <Calendar size={14} />
                <span>
                  {new Date(upcomingEvent.startTime).toLocaleString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <button
                onClick={() => navigate(`/live-battle/${upcomingEvent.id}`)}
                className={`w-full font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg ${
                  isLive ? "bg-red-600 hover:bg-red-700 text-white animate-bounce" : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {isLive ? "VÀO THI NGAY" : "Vào phòng chờ"} <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative group flex items-center gap-3 bg-white pl-4 pr-2 py-2 rounded-full shadow-lg shadow-slate-200 border border-amber-100"
      >
        <div className="flex flex-col items-start mr-2">
          <span className="text-[10px] font-bold uppercase text-amber-500 leading-none">Thi Đình</span>
          <span className="font-bold text-sm text-slate-800 leading-tight">Trạng Nguyên</span>
        </div>
        <div className={`${isLive ? "bg-red-500" : "bg-amber-500"} p-2 rounded-full text-white shadow-md group-hover:scale-110 transition`}>
          {isExpanded ? <X size={20} /> : <Trophy size={20} />}
        </div>

        {isLive && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default CompetitionWidget;
