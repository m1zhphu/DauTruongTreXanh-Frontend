import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import httpAdmin from '../../../services/httpAdmin'; 
import { MapPin, Plus, Edit, Trash2, Anchor } from 'lucide-react';

// Import dữ liệu bản đồ giống trang Edit
import { PROVINCE_PATHS } from '../../client/components/VietnamMapPaths'; // Đảm bảo đường dẫn đúng
import { VIETNAM_PROVINCES } from '../data/provinces'; // Để lấy tên hiển thị nếu cần

const MapRegionList = () => {
  const [regions, setRegions] = useState([]);
  const [hoveredId, setHoveredId] = useState(null); // State để xử lý hiệu ứng Hover

  const fetchRegions = useCallback(async () => {
    try {
      const res = await httpAdmin.get('/map/admin/all');
      setRegions(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    }
  }, []);

  /* useEffect(() => {
    fetchRegions();
  }, [fetchRegions]); */
  useEffect(() => {
    // FIX: Bọc việc gọi hàm trong một async function cục bộ để tránh lỗi ESLint
    const loadData = async () => {
      await fetchRegions();
    };
    loadData();
  }, [fetchRegions]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      await httpAdmin.delete(`/map/admin/region/${id}`);
      fetchRegions();
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Lỗi khi xóa! Có thể vùng này đang được sử dụng.");
    }
  };

  // Hàm xác định màu fill của tỉnh trên bản đồ SVG
  const getPathFill = (provinceId) => {
    // Nếu đang hover vào dòng trong bảng hoặc marker
    if (hoveredId === provinceId) return "#ef4444"; // Màu đỏ khi hover
    
    // Nếu tỉnh này đã được định nghĩa trong danh sách regions
    const isConfigured = regions.find(r => r.id === provinceId);
    if (isConfigured) return "#3b82f6"; // Màu xanh dương nếu đã có dữ liệu
    
    return "#4b5563"; // Màu xám mặc định
  };

  return (
    <div className="p-6 h-screen flex flex-col bg-slate-50">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản Lý Bản Đồ Game</h2>
          <p className="text-slate-500 text-sm">Hiển thị các vùng đã được cấu hình trên bản đồ Việt Nam</p>
        </div>
        <Link to="/admin/region/add" className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-orange-700 shadow-md transition-all">
          <Plus size={20} /> Thêm Vùng Mới
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* --- CỘT TRÁI: BẢN ĐỒ VIỆT NAM (Interactive) --- */}
        <div className="lg:w-5/12 bg-slate-900 rounded-xl relative border border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center p-4">
           {/* SVG Map Container */}
           <div className="relative w-full h-full max-h-[80vh] aspect-[3/4]">
              <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-2xl">
                 <g>
                   {Object.keys(PROVINCE_PATHS).map(key => (
                     <path 
                        key={key} 
                        d={PROVINCE_PATHS[key]} 
                        fill={getPathFill(key)} 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth="1"
                        className="transition-all duration-300 ease-in-out hover:opacity-80 cursor-pointer"
                        onMouseEnter={() => setHoveredId(key)}
                        onMouseLeave={() => setHoveredId(null)}
                     />
                   ))}
                 </g>
              </svg>

              {/* Render các Marker (Icon) đè lên bản đồ */}
              {regions.map(r => (
                <div 
                    key={r.id} 
                    className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white flex items-center justify-center text-white transition-all duration-300 z-10
                      ${r.color} 
                      ${hoveredId === r.id ? 'scale-150 ring-4 ring-white/50 z-50' : 'opacity-90'}
                    `}
                    style={{ top: r.topPos, left: r.leftPos }}
                    title={r.name}
                    onMouseEnter={() => setHoveredId(r.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                   {r.isIsland ? <Anchor size={12}/> : <MapPin size={12}/>}
                   
                   {/* Tooltip nhỏ khi hover */}
                   {hoveredId === r.id && (
                     <div className="absolute bottom-full mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {r.name}
                     </div>
                   )}
                </div>
              ))}
           </div>
           
           {/* Chú thích bản đồ */}
           <div className="absolute bottom-4 left-4 bg-slate-800/90 p-3 rounded-lg border border-slate-600 text-xs text-white">
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Đã cấu hình</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-gray-600 rounded-full"></div> Chưa cấu hình</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Đang chọn</div>
           </div>
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH --- */}
        <div className="lg:w-7/12 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr className="text-slate-500 text-xs uppercase border-b">
                  <th className="py-3 px-4">ID / Tỉnh</th>
                  <th className="py-3 px-4">Tên Hiển Thị</th>
                  <th className="py-3 px-4">Chủ đề (ID)</th>
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {regions.map(r => (
                  <tr 
                    key={r.id} 
                    className={`border-b transition-colors duration-200 cursor-pointer ${hoveredId === r.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}
                    onMouseEnter={() => setHoveredId(r.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <td className="py-3 px-4">
                        <div className="font-mono text-xs font-bold text-slate-400">{r.id}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[100px]">
                            {VIETNAM_PROVINCES.find(p => p.id === r.id)?.name}
                        </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">{r.name}</td>
                    <td className="py-3 px-4">
                        {r.topicId ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Topic {r.topicId}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400 italic">Trống</span>
                        )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                        {r.isIsland ? 
                            <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs font-medium"><Anchor size={12}/> Đảo</span> : 
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium"><MapPin size={12}/> Đất liền</span>
                        }
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/region/edit/${r.id}`} className="p-2 bg-white border border-slate-200 text-blue-600 rounded hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm">
                          <Edit size={16} />
                        </Link>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-2 bg-white border border-slate-200 text-red-600 rounded hover:bg-red-50 hover:border-red-300 transition-all shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {regions.length === 0 && (
                    <tr>
                        <td colSpan="5" className="text-center py-10 text-slate-400">Chưa có dữ liệu vùng nào. Hãy thêm mới!</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 border-t text-xs text-slate-500 text-center">
             Tổng cộng: {regions.length} vùng
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapRegionList;