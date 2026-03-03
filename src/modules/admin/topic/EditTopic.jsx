import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopicService from '../../../services/TopicService';
import { Save, ArrowLeft, Clock, Lock, Globe, FileText, CheckCircle, Loader2, X } from 'lucide-react';
import './AddTopic'; // Vẫn dùng chung CSS

const EditTopic = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    isPublic: true,
    accessCode: '',
    password: '',
    startNow: false,
    startTime: '',
    endTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);

  // --- Load Data ---
  useEffect(() => {
    const loadTopic = async () => {
      try {
        const res = await TopicService.getById(id);
        const data = res.data;
        setFormData({
          title: data.name || '',
          isPublic: data.public,
          accessCode: data.accessCode || '',
          password: data.password || '',
          startTime: data.startTime ? data.startTime.slice(0, 16) : '',
          endTime: data.endTime ? data.endTime.slice(0, 16) : '',
          startNow: false
        });
      } catch (error) {
        // [SỬA LỖI 1]: Sử dụng biến error để log ra console
        console.error("Lỗi tải topic:", error);
        setMessage({ type: 'error', text: 'Không tìm thấy chủ đề!' });
      } finally {
        setFetching(false);
      }
    };
    loadTopic();
  }, [id]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePublic = () => {
    setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (formData.startTime && formData.endTime && formData.startTime > formData.endTime) {
        setMessage({ type: 'error', text: '⚠️ Thời gian kết thúc phải sau thời gian bắt đầu!' });
        setLoading(false);
        return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('isPublic', formData.isPublic);
      if (formData.startTime) data.append('startTime', formData.startTime);
      if (formData.endTime) data.append('endTime', formData.endTime);
      if (!formData.isPublic) {
        data.append('accessCode', formData.accessCode);
        data.append('password', formData.password);
      }

      await TopicService.update(id, data);
      setMessage({ type: 'success', text: '✅ Cập nhật thành công!' });
      
      setTimeout(() => navigate('/admin/topics'), 1500);
    } catch (error) {
      // [SỬA LỖI 2]: Sử dụng biến error để log ra console
      console.error("Lỗi cập nhật:", error);
      const errorMsg = error.response?.data || "Lỗi cập nhật dữ liệu";
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex h-full items-center justify-center text-gray-500 p-20">Đang tải dữ liệu...</div>;

  return (
    <div className="w-full h-full bg-gray-50 p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center justify-between w-full mb-8">
        <div>
            <button onClick={() => navigate('/admin/topics')} className="text-gray-500 hover:text-blue-600 flex items-center gap-2 mb-2 transition-colors font-medium">
                <ArrowLeft size={20} /> Quay lại danh sách
            </button>
            <h1 className="text-4xl font-extrabold text-gray-800">Chỉnh sửa chủ đề <span className="text-blue-600">#{id}</span></h1>
        </div>
      </div>

      {/* MAIN CONTENT - GRID LAYOUT FULL WIDTH */}
      <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: THÔNG TIN CHÍNH (Chiếm 2/3) --- */}
        <div className="xl:col-span-2 space-y-8">
            
            {/* Card 1: Tên & Mô tả */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <FileText size={20} />
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">Thông tin chung</h3>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-base font-bold text-gray-700 mb-3">Tên bài học</label>
                        <input 
                            type="text" name="title" 
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base shadow-sm"
                            value={formData.title} onChange={handleChange} required 
                        />
                    </div>
                </div>
            </div>

            {/* Card 2: Thời gian */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                        <Clock size={20} />
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">Cài đặt thời gian</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Thời gian mở</label>
                        <input 
                            type="datetime-local" name="startTime"
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition text-base shadow-sm"
                            value={formData.startTime} onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Thời gian đóng</label>
                        <input 
                            type="datetime-local" name="endTime"
                            className="w-full px-5 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition text-base shadow-sm"
                            value={formData.endTime} onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* --- CỘT PHẢI: BẢO MẬT & ACTION (STICKY) --- */}
        <div className="xl:col-span-1 space-y-8">
            
            {/* Card 3: Bảo mật */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                        <Lock size={20} />
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">Quyền truy cập</h3>
                </div>

                <div 
                    onClick={togglePublic}
                    className={`flex items-center justify-between p-5 rounded-xl cursor-pointer transition-all border-2 ${formData.isPublic ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-orange-50 border-orange-200 shadow-sm'}`}
                >
                    <div className="flex items-center gap-4">
                        {formData.isPublic ? <Globe className="text-green-600" size={24} /> : <Lock className="text-orange-600" size={24} />}
                        <span className={`font-bold text-lg ${formData.isPublic ? 'text-green-700' : 'text-orange-700'}`}>
                            {formData.isPublic ? "Công khai" : "Riêng tư"}
                        </span>
                    </div>
                    <div className={`w-14 h-7 rounded-full relative transition-colors ${formData.isPublic ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${formData.isPublic ? 'left-8' : 'left-1'}`}></div>
                    </div>
                </div>

                {!formData.isPublic && (
                    <div className="mt-6 space-y-5 animate-fade-in">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Mã lớp (Room ID)</label>
                            <input 
                                type="text" name="accessCode"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white font-mono text-base shadow-sm"
                                value={formData.accessCode} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Mật khẩu</label>
                            <input 
                                type="text" name="password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white font-mono text-base shadow-sm"
                                value={formData.password} onChange={handleChange}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-6">
                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-base font-medium flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {message.type === 'success' ? <CheckCircle size={20}/> : <X size={20}/>}
                        {message.text}
                    </div>
                )}
                
                <div className="flex flex-col gap-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70 text-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                        {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/topics')}
                        className="w-full py-4 bg-white border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-lg shadow-sm"
                    >
                        Hủy Bỏ
                    </button>
                </div>
            </div>

        </div>
      </form>
    </div>
  );
};

export default EditTopic;