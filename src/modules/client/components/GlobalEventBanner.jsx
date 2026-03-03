import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Timer, ArrowRight, X, Calendar, Zap, Users } from "lucide-react";

import httpAxios from '../../../services/httpAxios';
function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatCountdown(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (days > 0) return `${days}d ${pad2(hours)}:${pad2(mins)}:${pad2(secs)}`;
  return `${pad2(hours)}:${pad2(mins)}:${pad2(secs)}`;
}

export default function GlobalEventBanner() {
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  // ===== VISIBILITY STATE =====
  const [hidden, setHidden] = useState(false);

  // Hàm ẩn banner thủ công
  const hideBanner = () => {
    if (event?.id) {
        localStorage.setItem(`event_banner_hidden_${event.id}`, "1");
    }
    setHidden(true);
  };

  // ===== DRAG STATE =====
  const W = 280; // Giảm kích thước chiều ngang (Compact)
  const H = 100;
  const [pos, setPos] = useState(() => ({
    x: Math.max(8, window.innerWidth - W - 24),
    y: 24, 
  }));

  const draggingRef = useRef(false);
  const offsetRef = useRef({ dx: 0, dy: 0 });

  const clampPos = (x, y) => {
    const margin = 8;
    const maxX = Math.max(margin, window.innerWidth - W - margin);
    const maxY = Math.max(margin, window.innerHeight - H - margin);
    return {
      x: Math.min(Math.max(margin, x), maxX),
      y: Math.min(Math.max(margin, y), maxY),
    };
  };

  const onMouseDown = (e) => {
    if (e.target.closest('button')) return;
    
    draggingRef.current = true;
    const rect = e.currentTarget.closest("[data-draggable-root]")?.getBoundingClientRect();
    if (!rect) return;

    offsetRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      setPos(clampPos(e.clientX - offsetRef.current.dx, e.clientY - offsetRef.current.dy));
    };
    const onUp = () => (draggingRef.current = false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    const onResize = () => setPos((p) => clampPos(p.x, p.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ===== FETCH EVENT =====
  useEffect(() => {
    const fetchBestEvent = async () => {
      try {
        const res = await httpAxios.get("/events/public-list");
        const allEvents = res.data || [];

        const liveEvent = allEvents.find(e => e.status === "LIVE");
        const upcomingEvents = allEvents
            .filter(e => e.status === "UPCOMING")
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        const targetEvent = liveEvent || upcomingEvents[0] || null;

        if (targetEvent) {
            setEvent(prev => {
                const isNewID = prev?.id !== targetEvent.id;
                const isJustWentLive = prev?.status !== "LIVE" && targetEvent.status === "LIVE";

                if (isNewID || isJustWentLive) {
                    setHidden(false); 
                    if (isNewID) {
                        const isPreviouslyHidden = localStorage.getItem(`event_banner_hidden_${targetEvent.id}`) === "1";
                        setHidden(isPreviouslyHidden);
                    }
                }
                return targetEvent;
            });
        } else {
            setEvent(null);
        }

      } catch (err) {
        console.log("Fetch event error:", err);
      }
    };

    fetchBestEvent();
    const t = setInterval(fetchBestEvent, 5000); 
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  // ===== VIEW MODEL =====
  const vm = useMemo(() => {
    if (!event) return null;

    const startMs = new Date(event.startTime).getTime();
    const durationMin = Number(event.durationMinutes ?? 30);
    const endMs = startMs + durationMin * 60_000;

    const status = String(event.status || "").toUpperCase();
    const isLiveTime = now >= startMs && now < endMs;
    const isEndedTime = now >= endMs;

    const isLive = status === "LIVE" || (status === "UPCOMING" && isLiveTime);
    const isUpcoming = status === "UPCOMING" && !isLiveTime;
    const isEnded = status === "ENDED" || isEndedTime;

    const msToStart = startMs - now;
    const msToEnd = endMs - now;
    const endedAgo = now - endMs;

    const showEnded = isEnded && endedAgo >= 0 && endedAgo <= 60_000;

    return { status, isUpcoming, isLive, isEnded, showEnded, msToStart, msToEnd, endMs };
  }, [event, now]);

  if (!event || !vm) return null;
  if (hidden) return null;

  const shouldShow = vm.isUpcoming || vm.isLive || vm.showEnded;
  if (!shouldShow) return null;

  const go = () => navigate(`/live-battle/${event.id}`);

  // ===== THEME CONFIGURATION =====
  const theme = vm.isLive 
    ? {
        container: "bg-slate-900 border-red-500/50 text-white shadow-red-900/20",
        badge: "bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40",
        title: "text-white/90",
        countdownMain: "text-white",
        countdownLabel: "text-white/50",
        buttonPrimary: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 border-0",
        buttonSecondary: "bg-white/10 hover:bg-white/20 text-white border-transparent",
        footer: "border-white/10 text-white/40",
        dragHandle: "bg-white/20"
      } 
    : {
        container: "bg-white/90 backdrop-blur-xl border-white/50 text-slate-800 shadow-slate-200/50",
        badge: "bg-blue-600 text-white shadow-md shadow-blue-500/30",
        title: "text-slate-800",
        countdownMain: "text-slate-900",
        countdownLabel: "text-slate-400",
        buttonPrimary: "bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-300/50",
        buttonSecondary: "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200",
        footer: "border-slate-100 text-slate-400",
        dragHandle: "bg-slate-200"
      };

  const badgeText = vm.isLive ? "LIVE" : vm.isUpcoming ? "SẮP TỚI" : "END";
  const countdownValue = vm.isLive ? formatCountdown(vm.msToEnd) : formatCountdown(vm.msToStart);

  return (
    <div
      data-draggable-root
      className="fixed z-[9999] pointer-events-auto transition-all duration-500 ease-spring"
      style={{ left: pos.x, top: pos.y, width: W }}
    >
      <div 
        className={`relative rounded-2xl border shadow-2xl p-4 overflow-hidden group select-none flex flex-col ${theme.container}`}
        onMouseDown={onMouseDown} 
      >
        {/* Decorative Background */}
        {vm.isLive && (
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-[40px] pointer-events-none animate-pulse-slow"></div>
        )}

        {/* --- HEADER --- */}
        <div className="flex justify-between items-start mb-2 relative z-10">
          <div className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 ${theme.badge}`}>
            {vm.isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            {badgeText}
          </div>

          <div className="flex items-center gap-2">
             <div className={`w-8 h-1 rounded-full cursor-move opacity-50 group-hover:opacity-100 transition-opacity ${theme.dragHandle}`}></div>
             <button onClick={hideBanner} className="opacity-40 hover:opacity-100 transition-opacity" title="Ẩn"><X size={14} /></button>
          </div>
        </div>

        {/* --- BODY --- */}
        <div className="relative z-10 cursor-move">
            {/* Tên sự kiện */}
            <h3 className={`font-bold text-xs leading-snug mb-2 line-clamp-1 ${theme.title}`} title={event.title}>
                {event.title}
            </h3>

            {/* Countdown Compact */}
            <div className="flex items-baseline gap-2 mb-3">
                <div className={`text-3xl font-black tracking-tighter leading-none font-mono ${theme.countdownMain}`}>
                    {countdownValue}
                </div>
                <div className={`text-[9px] font-bold uppercase tracking-wide ${theme.countdownLabel}`}>
                    {vm.isLive ? "Còn lại" : "Bắt đầu"}
                </div>
            </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="grid grid-cols-4 gap-2 relative z-10 mb-2">
            <button
              onClick={go}
              className={`col-span-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-transform active:scale-95 ${theme.buttonPrimary}`}
            >
              {vm.isLive ? "THAM GIA" : "VÀO PHÒNG"} <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/events')}
              className={`col-span-1 rounded-xl flex items-center justify-center transition-colors border ${theme.buttonSecondary}`}
              title="Xem lịch"
            >
              <Calendar size={16} />
            </button>
        </div>
        
        {/* --- FOOTER INFO --- */}
        <div className={`flex items-center justify-between pt-2 border-t text-[9px] font-bold uppercase tracking-wider relative z-10 ${theme.footer}`}>
            <span className="flex items-center gap-1">
                <Users size={10} /> {event.maxParticipants}
            </span>
            <span className="flex items-center gap-1">
                <Zap size={10} /> {event.durationMinutes}p
            </span>
        </div>
      </div>
    </div>
  );
}