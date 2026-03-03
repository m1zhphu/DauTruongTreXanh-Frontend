import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, User, Mail, Camera, Loader2, 
  Shield, AtSign, X
} from 'lucide-react';
import httpAxios from '../../../services/httpAxios';
import API_BASE_URL from '../../../services/apiConfig';

const EditProfile = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dữ liệu form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Dữ liệu chỉ đọc
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  // Xử lý ảnh
  const [currentAvatar, setCurrentAvatar] = useState(""); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  // FIX: Dùng lazy init cho Date.now() và bỏ setImageVersion vì không dùng
  const [imageVersion] = useState(() => Date.now());

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await httpAxios.get(`/users/me?t=${new Date().getTime()}`);
        const user = res.data;
        setName(user.name || "");
        setEmail(user.email || "");
        setUsername(user.username || "");
        setRole(user.role || "USER");
        setCurrentAvatar(user.avatarUrl);
        setLoading(false);
      } catch { // FIX: Bỏ biến err không dùng
        navigate(-1);
      }
    };
    fetchUser();
    // FIX: Thêm previewUrl vào dependency
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [navigate, previewUrl]);

  // --- HELPER URL ---
  const getAvatarUrl = () => {
    if (previewUrl) return previewUrl;
    if (!currentAvatar || currentAvatar === "default_avatar.png") {
        return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }
    if (currentAvatar.startsWith("http")) return currentAvatar;
    const backendRoot = API_BASE_URL.replace(/\/api\/?$/, ""); 
    return `${backendRoot}${currentAvatar}?v=${imageVersion}`;
  };

  // --- HANDLER ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chỉ chọn file ảnh!");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (selectedFile) formData.append("avatar", selectedFile);

      const res = await httpAxios.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = res.data;
      localStorage.setItem('client_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));
      setTimeout(() => navigate('/profile'), 500);
    } catch { // FIX: Bỏ biến error không dùng
      alert("Có lỗi xảy ra!");
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
       <Loader2 className="animate-spin text-slate-800" size={40} />
    </div>
  );

  return (
    // CONTAINER CHÍNH: Full màn hình, không scroll, căn giữa
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      
      {/* CARD LAYOUT: Chia đôi trên Desktop, Dọc trên Mobile */}
      <div className="bg-white w-full max-w-5xl h-full max-h-[800px] md:h-auto md:aspect-[16/9] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* === LEFT SIDE (Mobile: Top) - Tĩnh (Avatar, Username) === */}
        {/* Sử dụng màu tối (Slate-900) để tạo sự sang trọng */}
        <div className="w-full md:w-5/12 bg-slate-900 text-white relative flex flex-col items-center justify-center p-6 md:p-10 transition-all">
            
            {/* Back Button (Mobile only absolute, Desktop relative) */}
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 md:top-6 md:left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
                title="Quay lại"
            >
                <ArrowLeft size={20} className="text-white"/>
            </button>

            {/* Avatar Section */}
            <div className="relative group mb-6">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-tr from-emerald-400 to-cyan-500 shadow-2xl">
                    <img 
                        src={getAvatarUrl()} 
                        alt="Avatar" 
                        className="w-full h-full object-cover rounded-full border-4 border-slate-900 bg-slate-800"
                    />
                </div>
                
                {/* Edit Icon Overlay */}
                <label className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-emerald-500 text-white p-3 md:p-3.5 rounded-full shadow-lg cursor-pointer hover:bg-emerald-400 hover:scale-110 transition-all active:scale-95">
                    <Camera size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={saving} />
                </label>
            </div>

            {/* Static Info */}
            <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">{name || "Chưa đặt tên"}</h3>
                <p className="text-slate-400 font-medium mt-1 flex items-center justify-center gap-1">
                    <AtSign size={14}/> {username}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Shield size={12} /> {role.replace("ROLE_", "")}
                </div>
            </div>

            {/* Pattern Decoration (Optional) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>

        {/* === RIGHT SIDE (Mobile: Bottom) - Form Chỉnh Sửa === */}
        <div className="w-full md:w-7/12 bg-white p-6 md:p-12 flex flex-col justify-center h-full overflow-y-auto md:overflow-visible">
            
            <div className="mb-6 md:mb-8 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Chỉnh sửa hồ sơ</h2>
                <p className="text-slate-500 text-sm mt-1">Cập nhật thông tin cá nhân của bạn.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 flex-1 flex flex-col justify-center">
                
                {/* Input: Name */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <User size={16} className="text-emerald-600"/> Họ và Tên
                    </label>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 md:py-4 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                        placeholder="Nhập tên hiển thị"
                    />
                </div>

                {/* Input: Email */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Mail size={16} className="text-emerald-600"/> Email
                    </label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 md:py-4 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                        placeholder="example@mail.com"
                    />
                </div>

                {/* Action Buttons */}
                <div className="pt-4 md:pt-6 flex gap-3 md:gap-4 mt-auto md:mt-0">
                    <button 
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="flex-1 py-3.5 md:py-4 rounded-xl border border-gray-200 text-slate-600 font-bold hover:bg-gray-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
                    >
                        <X size={20} /> <span className="hidden sm:inline">Hủy</span>
                    </button>
                    
                    <button 
                        type="submit"
                        disabled={saving}
                        className="flex-[2] py-3.5 md:py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-slate-200 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {saving ? (
                            <><Loader2 size={20} className="animate-spin" /> Đang lưu...</>
                        ) : (
                            <><Save size={20} /> Lưu thay đổi</>
                        )}
                    </button>
                </div>
            </form>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;