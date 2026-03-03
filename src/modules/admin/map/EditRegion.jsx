import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpAdmin from '../../../services/httpAdmin';
import { Save, ArrowLeft, MapPin, Anchor, UploadCloud, Plus } from 'lucide-react';

// Import dữ liệu chuẩn
import { VIETNAM_PROVINCES } from '../data/provinces';
import { PROVINCE_PATHS } from '../../client/components/VietnamMapPaths';

const EditRegion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  
  // State dữ liệu
  const [allRegions, setAllRegions] = useState([]);
  const [topics, setTopics] = useState([]);

  const [form, setForm] = useState({
    id: '', 
    name: '', 
    description: '', 
    topPos: '', 
    leftPos: '', 
    color: 'bg-red-500', 
    requiredId: '', 
    isIsland: false,
    topicId: '' // ✅ ID chủ đề
  });

  // --- 1. LOAD DATA ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            // Lấy danh sách vùng & chủ đề
            const [resAll, resTopics, resDetail] = await Promise.all([
                httpAdmin.get('/map/admin/all'),
                httpAdmin.get('/questions/all-topics'),
                httpAdmin.get(`/map/admin/region/${id}`)
            ]);

            setAllRegions(resAll.data);
            setTopics(resTopics.data);
            setForm(resDetail.data);

        } catch(error) { 
            console.error("Lỗi tải dữ liệu:", error);
            alert("Không tìm thấy vùng này!");
            navigate('/admin/map');
        }
    };
    fetchData();
  }, [id, navigate]);

  // --- 2. LOGIC MAP CLICK ---
  const handleMapClick = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setForm(prev => ({ ...prev, topPos: `${y.toFixed(1)}%`, leftPos: `${x.toFixed(1)}%` }));
  };

  // --- 3. SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await httpAdmin.put(`/map/admin/region/${id}`, form);
      alert("Cập nhật thành công!");
      navigate('/admin/region');
    } catch (error) {
      console.error(error);
      alert("Lỗi server!");
    }
  };

  // Styles
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase mb-1";
  const inputStyle = "w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 overflow-hidden">
      
      {/* --- CỘT TRÁI: BẢN ĐỒ --- */}
      <div className="lg:w-2/3 bg-slate-900 relative cursor-crosshair flex items-center justify-center p-4" ref={mapRef} onClick={handleMapClick}>
         <div className="absolute top-4 left-4 z-20 bg-blue-600/90 text-white px-3 py-1 rounded shadow-lg pointer-events-none">
            ✏️ Đang sửa: {form.name} (Click để đổi vị trí)
         </div>
         
         {/* SVG Nền */}
         <svg viewBox="0 0 1000 1000" className="w-full h-full max-h-[90vh] pointer-events-none opacity-50">
             <g>
                 {Object.keys(PROVINCE_PATHS).map(key => (
                     <path key={key} d={PROVINCE_PATHS[key]} fill={form.id === key ? "#ef4444" : "#4b5563"} stroke="white" strokeWidth="0.5" />
                 ))}
             </g>
         </svg>

         {/* Điểm hiện tại */}
         {form.topPos && (
            <div className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white flex items-center justify-center text-white ${form.color} shadow-lg ring-4 ring-green-400 z-30`}
                 style={{ top: form.topPos, left: form.leftPos }}>
               {form.isIsland ? <Anchor size={20}/> : <MapPin size={20}/>}
            </div>
         )}

          {/* Các điểm khác (mờ) để tham chiếu */}
          {allRegions.filter(r => r.id !== id).map(r => (
             <div key={r.id} className="absolute w-3 h-3 bg-slate-600/50 rounded-full border border-slate-500" style={{ top: r.topPos, left: r.leftPos }} />
         ))}
      </div>

      {/* --- CỘT PHẢI: FORM --- */}
      <div className="lg:w-1/3 bg-white p-6 shadow-xl overflow-y-auto border-l">
         <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-slate-800">Chỉnh Sửa Vùng</h2>
             <button onClick={() => navigate('/admin/region')} className="text-slate-500 hover:text-slate-800 text-sm font-medium"><ArrowLeft size={16} className="inline"/> Quay lại</button>
         </div>
         
         <form onSubmit={handleSubmit} className="space-y-4">
             {/* ID Disable */}
             <div className="bg-gray-50 p-3 rounded border">
                <label className={labelStyle}>Mã vùng (ID - Không thể sửa)</label>
                <div className="font-mono text-slate-600 font-bold">{form.id}</div>
                {/* Hiển thị tên tỉnh tương ứng từ file data */}
                <div className="text-xs text-gray-400 mt-1">
                    {VIETNAM_PROVINCES.find(p => p.id === form.id)?.name || "Mã vùng tùy chỉnh"}
                </div>
             </div>
             
             <div>
                <label className={labelStyle}>Tên hiển thị</label>
                <input className={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
             </div>

             {/* CHỌN CHỦ ĐỀ */}
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <label className={`${labelStyle} text-blue-700`}>Gắn Với Chủ Đề (Bài Học)</label>
                 <select className={`${inputStyle} bg-white`} value={form.topicId || ''} onChange={e => setForm({...form, topicId: e.target.value})}>
                    <option value="">-- Chọn chủ đề có sẵn --</option>
                    {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.totalKnots} câu)</option>
                    ))}
                 </select>
             </div>

             {/* Tọa độ */}
             <div className="grid grid-cols-2 gap-2">
                <div><label className={labelStyle}>Top %</label><input className={`${inputStyle} bg-gray-100`} value={form.topPos} readOnly /></div>
                <div><label className={labelStyle}>Left %</label><input className={`${inputStyle} bg-gray-100`} value={form.leftPos} readOnly /></div>
             </div>

             <div>
                <label className={labelStyle}>Mô tả ngắn</label>
                <textarea className={`${inputStyle} h-24`} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
             </div>

             <div className="grid grid-cols-2 gap-2">
                 <div>
                     <label className={labelStyle}>Màu Marker</label>
                     <select className={inputStyle} value={form.color} onChange={e => setForm({...form, color: e.target.value})}>
                        <option value="bg-red-500">Đỏ</option>
                        <option value="bg-blue-500">Xanh Dương</option>
                        <option value="bg-green-500">Xanh Lá</option>
                        <option value="bg-yellow-500">Vàng</option>
                        <option value="bg-purple-600">Tím</option>
                     </select>
                 </div>
                 <div>
                     <label className={labelStyle}>Loại</label>
                     <select className={inputStyle} value={form.isIsland ? 'true' : 'false'} onChange={e => setForm({...form, isIsland: e.target.value === 'true'})}>
                        <option value="false">Đất liền</option>
                        <option value="true">Hải đảo</option>
                     </select>
                 </div>
             </div>

             <div>
                <label className={labelStyle}>Yêu cầu hoàn thành vùng:</label>
                <select className={inputStyle} value={form.requiredId || ''} onChange={e => setForm({...form, requiredId: e.target.value})}>
                    <option value="">-- Mở đầu (Không yêu cầu) --</option>
                    {allRegions.filter(r => r.id !== id).map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
             </div>

             <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 mt-6 shadow-lg flex items-center justify-center gap-2">
                <Save size={20}/> Lưu Thay Đổi
             </button>
         </form>
      </div>
    </div>
  );
};

export default EditRegion;