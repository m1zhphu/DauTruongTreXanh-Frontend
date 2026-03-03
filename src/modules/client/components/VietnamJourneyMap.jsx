import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpAxios from "../../../services/httpAxios"; // Đổi lại đường dẫn đúng của bạn
import { PROVINCE_PATHS } from "./VietnamMapPaths"; // File data SVG
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  MapPin, Star, BookOpen, Anchor, Swords, 
  Compass, ZoomIn, ZoomOut, RotateCcw, X, Layers,
  ArrowLeft // <-- Đã thêm icon ArrowLeft
} from "lucide-react";

// --- 1. CẤU HÌNH THEME & MÀU SẮC ---
const MAP_THEME = {
  // Màu nền tổng thể
  bg_gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
  
  // Màu của các tỉnh trên bản đồ
  locked: { fill: "#f1f5f9", stroke: "#cbd5e1" }, // Xám nhạt (Locked)
  unlocked: { fill: "#bae6fd", stroke: "#fff" },   // Xanh trời (Unlocked)
  completed: { fill: "#86efac", stroke: "#fff" },  // Xanh lá (Done)
  selected: { fill: "#6366f1", stroke: "#fff" },   // Tím indigo (Đang chọn)
  
  // Hiệu ứng Hover
  hover_class: "hover:fill-indigo-300 hover:filter hover:drop-shadow-lg",
};

// --- 2. COMPONENT BẢN ĐỒ SVG ---
const VietnamSVG = ({ regions, selectedRegion, onRegionClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      className="w-full h-full pointer-events-auto select-none"
      style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.05))" }} // Đổ bóng toàn bản đồ
    >
      <defs>
        <linearGradient id="grad-locked" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* --- LAYER ĐẤT LIỀN --- */}
      <g className="map-provinces">
        {regions.map((region) => {
          const isSelected = selectedRegion?.id === region.id;
          const isCompleted = region.status === 'completed';
          const isLocked = region.status === 'locked' || !region.status;

          let fill = "url(#grad-locked)"; // Mặc định gradient xám
          let stroke = MAP_THEME.locked.stroke;
          let strokeWidth = "0.5";

          if (!isLocked) { fill = MAP_THEME.unlocked.fill; stroke = MAP_THEME.unlocked.stroke; }
          if (isCompleted) { fill = MAP_THEME.completed.fill; stroke = MAP_THEME.completed.stroke; }
          if (isSelected) { fill = MAP_THEME.selected.fill; stroke = MAP_THEME.selected.stroke; strokeWidth = "2"; }

          const pathData = PROVINCE_PATHS[region.id] || "M0 0";

          return (
            <path
              key={region.id}
              id={region.id}
              d={pathData}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              className={`
                transition-all duration-300 ease-out cursor-pointer outline-none
                ${!isLocked && !isSelected ? "hover:-translate-y-1 hover:fill-indigo-400" : ""}
                ${isSelected ? "filter drop-shadow-md z-10 relative" : ""}
                ${isLocked ? "cursor-not-allowed opacity-80" : ""}
              `}
              onClick={(e) => onRegionClick(e, region)}
            />
          );
        })}
      </g>

      {/* --- LAYER ĐẢO (Hoàng Sa / Trường Sa) --- */}
      {["hoangsa", "truongsa"].map((islandKey) => (
        PROVINCE_PATHS[islandKey] && (
          <g key={islandKey} className="opacity-70 hover:opacity-100 transition-opacity">
            <path 
              d={PROVINCE_PATHS[islandKey]} 
              fill="#93c5fd" 
              stroke="#fff" 
              strokeWidth="1"
            />
            <text 
              x={islandKey === "hoangsa" ? "730" : "780"} 
              y={islandKey === "hoangsa" ? "290" : "660"} 
              fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="600" className="uppercase tracking-widest"
            >
              {islandKey === "hoangsa" ? "Hoàng Sa" : "Trường Sa"}
            </text>
          </g>
        )
      ))}
      
      {/* --- DECORATION --- */}
      <text x="850" y="500" fill="#e2e8f0" fontSize="80" fontWeight="900" textAnchor="middle" style={{ writingMode: 'vertical-rl', opacity: 0.5 }}>
        Biển Đông
      </text>
    </svg>
  );
};

// --- 3. TRANG CHÍNH ---
const VietnamJourneyPage = () => {
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      // Code thật:
      const res = await httpAxios.get("/map/my-journey");
      // Flatten object nếu API trả về lồng nhau
      const formattedData = res.data.map(item => ({ 
          ...item.region, 
          status: item.status 
      }));
      setRegions(formattedData);
      
    } catch (err) {
      console.error("Lỗi tải map:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = (e, region) => {
    if (region.status === "locked") return;
    setSelectedRegion(region);
  };

  // --- Render Loading ---
  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="relative">
         <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-indigo-600">VN</div>
      </div>
      <span className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu bản đồ...</span>
    </div>
  );

  return (
    <div className={`h-screen w-screen overflow-hidden relative font-sans text-slate-800 ${MAP_THEME.bg_gradient}`}>
      
      {/* --- NEW: NÚT QUAY LẠI (TOP RIGHT) --- */}
      <button 
        onClick={() => navigate(-1)} // Quay lại trang trước
        className="absolute top-6 right-6 z-40 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/50 text-slate-500 hover:bg-white hover:text-indigo-600 transition-all hover:scale-110 hover:shadow-indigo-200 group"
        title="Quay lại"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform"/>
      </button>

      {/* --- A. HEADER NỔI (Glassmorphism) --- */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-4">
        <div className="bg-white/70 backdrop-blur-xl p-4 pr-8 rounded-[24px] shadow-xl border border-white/40 flex items-center gap-4 transition-all hover:scale-[1.02]">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-3 rounded-2xl shadow-lg shadow-indigo-300">
            <Compass className="text-white animate-[spin_10s_linear_infinite]" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">HÀNH TRÌNH XUYÊN VIỆT</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase mt-1 tracking-wider">Hành trình khám phá tri thức</p>
          </div>
        </div>

        {/* Stats Mini Card */}
        <div className="bg-white/60 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-white/40 flex items-center gap-6 w-fit">
           <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Đã mở</span>
              <span className="text-xl font-bold text-indigo-600 leading-none">{regions.filter(r => r.status !== 'locked').length}</span>
           </div>
           <div className="w-px h-6 bg-slate-300"></div>
           <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Hoàn thành</span>
              <span className="text-xl font-bold text-emerald-500 leading-none">{regions.filter(r => r.status === 'completed').length}</span>
           </div>
        </div>
      </div>

      {/* --- B. BẢN ĐỒ CHÍNH (ZOOM/PAN) --- */}
      <div className="w-full h-full relative z-10">
        <TransformWrapper
          initialScale={1.1}
          minScale={0.8}
          maxScale={6}
          centerOnInit={true}
          smooth={true}
          wheel={{ step: 0.2 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Controls Toolbar (Bottom Left) */}
              <div className="absolute bottom-8 left-8 z-40 flex flex-col gap-2 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-2 border border-white/50">
                <button onClick={() => zoomIn()} className="p-3 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors" title="Phóng to"><ZoomIn size={20}/></button>
                <button onClick={() => zoomOut()} className="p-3 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors" title="Thu nhỏ"><ZoomOut size={20}/></button>
                <div className="h-px bg-slate-200 my-1 mx-2"></div>
                <button onClick={() => resetTransform()} className="p-3 hover:bg-indigo-50 rounded-xl text-indigo-600 transition-colors" title="Đặt lại"><RotateCcw size={20}/></button>
              </div>

              {/* Map Canvas */}
              <TransformComponent 
                wrapperClass="!w-full !h-full" 
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                <div 
                  className="w-[95vh] h-[95vh] relative transition-transform duration-300"
                  // Click vùng trống để đóng Drawer
                  onClick={(e) => {
                    if(e.target === e.currentTarget) setSelectedRegion(null);
                  }}
                >
                  <VietnamSVG 
                    regions={regions} 
                    selectedRegion={selectedRegion} 
                    onRegionClick={handleRegionClick} 
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* --- C. INFO DRAWER (FLOATING CARD) --- */}
      <div 
        className={`absolute top-4 bottom-4 right-4 w-[400px] z-50 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform 
          ${selectedRegion ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}
        `}
      >
        {selectedRegion && (
          <div className="h-full bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/60 flex flex-col overflow-hidden relative ring-1 ring-slate-900/5">
            
            {/* 1. Header Card Image */}
            <div className={`h-48 relative flex items-end p-8 overflow-hidden group`}>
               {/* Dynamic Background Color based on Topic/Status */}
               <div className={`absolute inset-0 bg-gradient-to-br 
                  ${selectedRegion.status === 'completed' ? 'from-emerald-400 to-teal-600' : 'from-indigo-500 via-purple-500 to-pink-500'}
               `}></div>
               
               {/* Texture Overlay */}
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
               
               {/* Content */}
               <div className="relative z-10 text-white w-full translate-y-0 transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="flex gap-2 items-center mb-2 opacity-90">
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        {selectedRegion.isIsland ? <Anchor size={10}/> : <MapPin size={10}/>}
                        {selectedRegion.isIsland ? "Hải Đảo" : "Tỉnh Thành"}
                    </span>
                    {selectedRegion.status === 'completed' && (
                        <span className="bg-emerald-400/30 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-emerald-100 border border-emerald-400/50">
                            Completed
                        </span>
                    )}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight shadow-black drop-shadow-lg">{selectedRegion.name}</h2>
               </div>

               {/* Close Button */}
                <button 
                  onClick={() => setSelectedRegion(null)}
                  className="absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full text-white/80 transition-colors backdrop-blur-md"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* 2. Body Content */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-white to-slate-50">
              
              {/* Description Section */}
              <div className="mb-8">
                 <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2 tracking-wider">
                    <BookOpen size={14} className="text-indigo-500"/> Tổng quan
                 </h3>
                 <p className="text-slate-600 leading-relaxed text-[15px] font-medium text-justify">
                    {selectedRegion.description || "Thông tin về vùng đất này đang được các nhà sử học cập nhật. Hãy quay lại sau để khám phá thêm nhé!"}
                 </p>
              </div>

              {/* Progress / Status Section */}
              <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2 tracking-wider">
                    <Layers size={14} className="text-indigo-500"/> Trạng thái
                 </h3>
                 
                 {selectedRegion.status === 'completed' ? (
                     <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                        <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600 shadow-emerald-200 shadow-md">
                           <Star size={24} fill="currentColor"/>
                        </div>
                        <div>
                           <p className="text-emerald-800 font-bold text-base">Đã chinh phục!</p>
                           <p className="text-emerald-600 text-sm mt-1">Bạn đã xuất sắc hoàn thành tất cả thử thách tại vùng đất này.</p>
                        </div>
                     </div>
                 ) : (
                     <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                        <div className="bg-indigo-100 p-2.5 rounded-full text-indigo-600 shadow-indigo-200 shadow-md">
                           <Swords size={24}/>
                        </div>
                        <div>
                           <p className="text-indigo-800 font-bold text-base">Sẵn sàng khiêu chiến?</p>
                           <p className="text-indigo-600 text-sm mt-1">Hoàn thành bài tập để mở khóa vùng đất tiếp theo trên bản đồ.</p>
                        </div>
                     </div>
                 )}
              </div>
            </div>

            {/* 3. Footer Actions */}
            <div className="p-6 bg-white border-t border-slate-100">
               <button 
                  onClick={() => {
                     if(selectedRegion.topicId) navigate(`/game/${selectedRegion.topicId}`);
                  }}
                  disabled={!selectedRegion.topicId}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:translate-y-0
                    ${!selectedRegion.topicId 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200" 
                      : selectedRegion.status === 'completed'
                          ? "bg-white text-emerald-600 border-2 border-emerald-500 hover:bg-emerald-50 shadow-emerald-100"
                          : "bg-slate-900 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:bg-slate-800"
                    }
                  `}
               >
                  {selectedRegion.topicId ? (
                     <>
                        {selectedRegion.status === 'completed' ? <RotateCcw size={20}/> : <Swords size={20}/>} 
                        {selectedRegion.status === 'completed' ? 'Luyện Tập Lại' : 'Bắt Đầu Thử Thách'}
                     </>
                  ) : (
                     "Đang Cập Nhật"
                  )}
               </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default VietnamJourneyPage;