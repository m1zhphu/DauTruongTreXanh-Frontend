import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  LayoutDashboard,
  Server,
  Activity,
  Cpu
} from 'lucide-react';

// Import instance axios đã cấu hình riêng
// Đảm bảo đường dẫn này đúng với nơi bạn tạo file httpAdmin.js
import httpAdmin from '../../../services/httpAdmin'; 

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // --- THEME ADMIN: CYBER DARK ---
  const theme = {
    bgGradient: "from-slate-900 via-slate-900 to-indigo-950",
    buttonGradient: "bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 border border-slate-600",
    buttonShadow: "shadow-slate-900/50",
    inputFocus: "focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500",
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Sử dụng httpAdmin thay vì axios thường
      const res = await httpAdmin.post('/auth/login', formData);
      const data = res.data || res; 
      
      console.log("LOGIN RESPONSE:", data); 

      // 1. Lấy Token và User Info
      const token = data.token || data.accessToken;
      const userInfo = data.user || data; 

      if (!token) {
        throw new Error("Không tìm thấy token xác thực từ server");
      }

      // 2. Kiểm tra quyền ADMIN
      const userRole = userInfo.role || userInfo.roles?.[0] || ""; 
      console.log("CHECK ROLE:", userRole);

      // Lưu ý: Đảm bảo backend trả về đúng chuỗi này
      if (userRole !== 'ROLE_ADMIN' && userRole !== 'ADMIN') {
         throw new Error(`Tài khoản không có quyền quản trị! (Quyền hiện tại: ${userRole})`);
      }

      // 3. Lưu thông tin (QUAN TRỌNG: Key này phải khớp với key trong httpAdmin.js)
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(userInfo));
      
      window.dispatchEvent(new Event("adminLoginSuccess"));
      
      // 4. Chuyển trang
      navigate('/admin/dashboard'); 

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setErrorMsg(err.response?.data?.message || err.message || 'Đăng nhập thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-slate-50">
      <style>{`input::-ms-reveal, input::-ms-clear { display: none; }`}</style>

      {/* === LEFT SIDE: BANNER === */}
      <div className="hidden lg:flex lg:w-7/12 relative overflow-hidden bg-slate-900 items-center justify-center p-12">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${theme.bgImage})` }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 opacity-95`} />
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

        <div className="relative z-10 max-w-xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 backdrop-blur-md border border-indigo-500/30 text-xs font-bold text-indigo-300 mb-8 shadow-lg shadow-indigo-500/10">
            <ShieldCheck size={14} className="text-indigo-400" /> 
            <span className="tracking-wider">SECURE ADMIN PORTAL</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-xl">
            Trung tâm <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              Điều hành Hệ thống
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-12 max-w-md leading-relaxed font-light border-l-4 border-indigo-500 pl-6">
            Quản lý tài nguyên, giám sát hoạt động và bảo mật dữ liệu toàn diện cho nền tảng giáo dục.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Server size={24} />
              </div>
              <div>
                <span className="block text-sm text-slate-400 font-medium">Server Status</span>
                <span className="flex items-center gap-2 text-green-400 text-xs font-bold mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Online
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-300">
                <Activity size={24} />
              </div>
              <div>
                <span className="block text-sm text-slate-400 font-medium">System Load</span>
                <span className="block text-white text-sm font-bold mt-1">Optimized</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-12 text-slate-600 text-xs font-mono tracking-widest opacity-60">
          ID: ADMIN-GATEWAY-V2.4 • ENCRYPTED
        </div>
      </div>

      {/* === RIGHT SIDE: FORM === */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 xl:p-16 bg-white relative">
        <div className="w-full max-w-[400px]">
          
          <div className="lg:hidden flex justify-center mb-10">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl border border-slate-800">
              <LayoutDashboard size={28} />
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <div className="inline-block mb-3">
              <span className="px-3 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">
                Administrator
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Đăng Nhập Quản Trị
            </h2>
            <p className="text-slate-500 text-sm">
              Vui lòng xác thực danh tính để truy cập.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <ShieldCheck size={18} className="text-red-600"/>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tài khoản Admin</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-semibold transition-all duration-200 ${theme.inputFocus} outline-none pl-12`}
                  placeholder="admin_id"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <User size={20} className="text-slate-400 group-focus-within:text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mã bảo mật</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-semibold transition-all duration-200 ${theme.inputFocus} outline-none pl-12 pr-12`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <Lock size={20} className="text-slate-400 group-focus-within:text-indigo-600" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg text-white font-bold text-sm uppercase tracking-widest shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${theme.buttonGradient} ${theme.buttonShadow} mt-4`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                  <span>Đang xác thực...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Truy cập</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-12 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
              <Cpu size={14} />
              <span>Hệ thống giám sát và quản lý nội bộ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;