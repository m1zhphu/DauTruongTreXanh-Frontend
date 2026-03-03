import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpAdmin from '../../../services/httpAdmin';
import { Save, ArrowLeft, UploadCloud, X, Loader, Plus, Map, Layers, FileText } from 'lucide-react';

// Import dữ liệu chuẩn
import { VIETNAM_PROVINCES } from '../data/provinces'; 
import { PROVINCE_PATHS } from '../../client/components/VietnamMapPaths'; 

const AddRegion = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [existingRegions, setExistingRegions] = useState([]); 
  const [topics, setTopics] = useState([]);
  
  // Form State
  const [form, setForm] = useState({
    id: '', 
    name: '', 
    description: '', 
    topPos: '0%',  // Mặc định (vì giờ dùng SVG path nên không cần tọa độ này nữa)
    leftPos: '0%', // Mặc định
    color: 'bg-red-500', 
    requiredId: '', 
    isIsland: false,
    topicId: '' 
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [topicForm, setTopicForm] = useState({
    title: '', file: null, numQuestions: 10, isPublic: true, 
    accessCode: '', password: '', startTime: '', endTime: ''
  });

  // --- INIT DATA ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [resRegions, resTopics] = await Promise.all([
                httpAdmin.get('/map/admin/all'),
                httpAdmin.get('/questions/all-topics')
            ]);
            setExistingRegions(resRegions.data);
            setTopics(resTopics.data);
        } catch(e) { console.error("Lỗi tải dữ liệu:", e); }
    };
    fetchData();
  }, []);

  // --- HANDLE SELECT PROVINCE ---
  const handleSelectProvince = (e) => {
    const selectedId = e.target.value;
    const province = VIETNAM_PROVINCES.find(p => p.id === selectedId);

    if (province) {
        setForm(prev => ({
            ...prev,
            id: province.id,       // ID chuẩn từ file data
            name: province.name,   // Tên chuẩn từ file data
            isIsland: province.id === 'hoangsa' || province.id === 'truongsa'
        }));
    } else {
        setForm(prev => ({ ...prev, id: '', name: '' }));
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id) return alert("⚠️ Vui lòng chọn Tỉnh/Thành phố!");
    
    try {
      await httpAdmin.post('/map/admin/region', form);
      alert("✅ Thêm vùng thành công!");
      navigate('/admin/region');
    } catch {
      alert("❌ Lỗi: Vùng này có thể đã tồn tại hoặc lỗi server.");
    }
  };

  // --- CREATE TOPIC (N8N) ---
  const handleCreateTopic = async (e) => {
      e.preventDefault();
      if (!topicForm.file || !topicForm.title) return alert("Thiếu tên hoặc file PDF!");

      setIsCreatingTopic(true);
      try {
          const formData = new FormData();
          formData.append('file', topicForm.file);
          formData.append('title', topicForm.title);
          formData.append('numQuestions', topicForm.numQuestions);
          formData.append('isPublic', topicForm.isPublic);
          if(!topicForm.isPublic) {
              formData.append('accessCode', topicForm.accessCode);
              formData.append('password', topicForm.password);
          }
          const res = await httpAdmin.post('/questions/create-full-topic', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });

          alert("✅ Tạo chủ đề thành công!");
          const resTopics = await httpAdmin.get('/questions/all-topics');
          setTopics(resTopics.data);
          setForm(prev => ({ ...prev, topicId: res.data.topicId }));
          setShowModal(false);
      } catch (err) {
          alert("❌ Lỗi tạo chủ đề: " + (err.response?.data || err.message));
      } finally {
          setIsCreatingTopic(false);
      }
  };

  // --- STYLES ---
  const labelStyle = "block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2";
  const inputStyle = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-700 bg-white font-medium";
  const sectionStyle = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* ================= CỘT TRÁI: BẢN ĐỒ PREVIEW ================= */}
      <div className="flex-1 bg-[#1e293b] flex items-center justify-center p-8 overflow-hidden relative">
         <div className="absolute top-6 left-6 z-20 text-white/50 text-sm font-medium">
            <Map size={16} className="inline mr-2"/> Bản đồ hiển thị
         </div>

         <div className="relative w-full h-full max-w-[800px] max-h-[90vh] transition-transform duration-500">
             {/* Render Bản đồ từ File SVG Path */}
             <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-2xl">
                 <g>
                     {Object.keys(PROVINCE_PATHS).map(key => {
                         // Logic Highlight: Nếu key trùng với ID đang chọn -> Màu Đỏ, còn lại màu tối
                         const isSelected = form.id === key;
                         return (
                             <path 
                                key={key} 
                                d={PROVINCE_PATHS[key]} 
                                fill={isSelected ? "#ef4444" : "#334155"} 
                                stroke={isSelected ? "#ffffff" : "#475569"} 
                                strokeWidth={isSelected ? "2" : "0.5"} 
                                className={`transition-all duration-300 ${isSelected ? "drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" : "opacity-50"}`}
                             />
                         );
                     })}
                 </g>
                 
                 {/* Text Biển Đông */}
                 <text x="850" y="450" fill="rgba(255,255,255,0.05)" fontSize="60" fontWeight="bold" textAnchor="middle" style={{ writingMode: 'vertical-rl', letterSpacing: '10px' }}>
                    BIỂN ĐÔNG
                 </text>
             </svg>
         </div>
      </div>

      {/* ================= CỘT PHẢI: FORM NHẬP LIỆU ================= */}
      <div className="w-[500px] bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl z-20">
         
         {/* Header */}
         <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
             <div>
                <h2 className="text-2xl font-bold text-slate-800">Thêm Địa Danh</h2>
                <p className="text-slate-400 text-xs mt-1">Chọn tỉnh thành để kích hoạt trên bản đồ</p>
             </div>
             <button onClick={() => navigate('/admin/region')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <X size={24} />
             </button>
         </div>
         
         {/* Form Body */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
             <form id="add-region-form" onSubmit={handleSubmit} className="space-y-6">
                 
                 {/* 1. Chọn Tỉnh Thành */}
                 <div className={sectionStyle}>
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">1. Vị trí địa lý</h3>
                    <div>
                        <label className={labelStyle}>Chọn Tỉnh / Thành Phố</label>
                        <select 
                            className={`${inputStyle} border-blue-200 bg-blue-50/30 text-blue-900 font-bold`} 
                            value={form.id} 
                            onChange={handleSelectProvince} 
                            required
                        >
                            <option value="">-- Chọn địa danh --</option>
                            {VIETNAM_PROVINCES.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-2">
                            * ID và Tên sẽ được tự động điền chuẩn theo dữ liệu hệ thống.
                        </p>
                    </div>
                 </div>

                 {/* 2. Cấu hình màu sắc */}
                 <div className={sectionStyle}>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">2. Giao diện</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Màu sắc (Khi chọn)</label>
                            <select className={inputStyle} value={form.color} onChange={e => setForm({...form, color: e.target.value})}>
                                <option value="bg-red-500">🔴 Đỏ</option>
                                <option value="bg-blue-500">🔵 Xanh Dương</option>
                                <option value="bg-green-500">🟢 Xanh Lá</option>
                                <option value="bg-yellow-500">🟡 Vàng</option>
                                <option value="bg-purple-600">🟣 Tím</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelStyle}>Loại địa hình</label>
                            <input className={`${inputStyle} bg-slate-100 text-slate-500`} value={form.isIsland ? "Hải Đảo" : "Đất Liền"} readOnly />
                        </div>
                     </div>
                 </div>

                 {/* 3. Nội dung bài học */}
                 <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
                     <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Layers size={14}/> 3. Nội dung & Điều kiện
                     </h3>
                     
                     <div>
                         <label className={`${labelStyle} text-blue-800`}>Bộ Câu Hỏi (Chủ đề)</label>
                         <div className="flex gap-2">
                             <select className={`${inputStyle} bg-white border-blue-200 focus:border-blue-500`} value={form.topicId} onChange={e => setForm({...form, topicId: e.target.value})}>
                                <option value="">-- Chọn chủ đề --</option>
                                {topics.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.totalKnots} câu)</option>
                                ))}
                             </select>
                             <button type="button" onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform hover:scale-105" title="Tạo mới bằng AI">
                                <Plus size={20} />
                             </button>
                         </div>
                     </div>

                     <div>
                        <label className={`${labelStyle} text-blue-800`}>Mở khóa sau khi xong:</label>
                        <select className={`${inputStyle} bg-white border-blue-200`} value={form.requiredId} onChange={e => setForm({...form, requiredId: e.target.value})}>
                            <option value="">-- Mở đầu (Không yêu cầu) --</option>
                            {existingRegions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                     </div>

                     <div>
                        <label className={labelStyle}><FileText size={16}/> Mô tả ngắn</label>
                        <textarea className={`${inputStyle} h-24 resize-none`} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Giới thiệu về vùng đất này..." />
                    </div>
                 </div>

             </form>
         </div>

         {/* Footer Actions */}
         <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10">
             <button type="submit" form="add-region-form" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-slate-300 flex items-center justify-center gap-3">
                <Save size={20}/> Lưu Địa Danh
             </button>
         </div>
      </div>

      {/* --- MODAL TẠO CHỦ ĐỀ AI (Giữ nguyên) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2"><UploadCloud size={20}/> Tạo Chủ Đề AI</h3>
                    <button onClick={() => setShowModal(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><X size={20}/></button>
                </div>
                
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    {isCreatingTopic ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                                <Loader size={64} className="animate-spin text-blue-600 relative z-10" />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-800 font-bold text-lg">AI đang đọc tài liệu...</p>
                                <p className="text-slate-500 text-sm mt-1">Quá trình này mất khoảng 30-60 giây.</p>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-5">
                            <div>
                                <label className={labelStyle}>Tên Chủ Đề</label>
                                <input className={inputStyle} value={topicForm.title} onChange={e => setTopicForm({...topicForm, title: e.target.value})} placeholder="VD: Lịch sử Việt Nam" />
                            </div>
                            <div>
                                <label className={labelStyle}>File PDF (Nguồn)</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative bg-slate-50 hover:bg-blue-50">
                                    <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setTopicForm({...topicForm, file: e.target.files[0]})} />
                                    <UploadCloud size={32} className="mx-auto text-slate-400 mb-2"/>
                                    <span className="text-sm text-slate-600 font-medium">{topicForm.file ? topicForm.file.name : "Kéo thả hoặc click để chọn file"}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelStyle}>Số câu hỏi</label><input type="number" className={inputStyle} value={topicForm.numQuestions} onChange={e => setTopicForm({...topicForm, numQuestions: e.target.value})} /></div>
                                <div><label className={labelStyle}>Chế độ</label><select className={inputStyle} value={topicForm.isPublic} onChange={e => setTopicForm({...topicForm, isPublic: e.target.value === 'true'})}><option value="true">Công khai</option><option value="false">Riêng tư</option></select></div>
                            </div>
                        </form>
                    )}
                </div>

                {!isCreatingTopic && (
                    <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
                        <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-colors">Hủy bỏ</button>
                        <button onClick={handleCreateTopic} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                            <Save size={18} /> Tạo Ngay
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AddRegion;