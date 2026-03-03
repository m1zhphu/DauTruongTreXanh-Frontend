import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  BookOpen, 
  GraduationCap,
  Sparkles,
  Users,
  Trophy,
  Home, // Thêm icon Home
  ChevronLeft
} from 'lucide-react';
import httpAxios from '../../../services/httpAxios';

// -----------------------------------------------------------------------

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // --- THEME ---
  const theme = {
primaryGradient: "from-gray-600 via-gray-700 to-gray-900",
    buttonGradient: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
    buttonShadow: "shadow-blue-200",
    inputFocus: "focus:ring-blue-500/20 focus:border-blue-500",
    textHighlight: "from-blue-600 to-cyan-500",
    bgImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await httpAxios.post('/auth/login', formData);
      const data = res.data || res;
      const token = data.token || data.accessToken;
      const userInfo = data.user || data;

      if (token) {
        localStorage.setItem('client_token', token);
        localStorage.setItem('client_user', JSON.stringify(userInfo));
        
        localStorage.removeItem('token'); 
        localStorage.removeItem('user');

        window.dispatchEvent(new Event("clientLoginSuccess"));
        navigate('/'); 
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white overflow-hidden">
      {/* CSS fix ẩn icon con mắt trình duyệt */}
      <style>{`input::-ms-reveal, input::-ms-clear { display: none; }`}</style>
      
      {/* === LEFT SIDE: BANNER (NÂNG CẤP) === */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-slate-900 items-center justify-center p-12 overflow-hidden group">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-[60s] group-hover:scale-110"
          style={{ backgroundImage: `url(${theme.bgImage})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.primaryGradient} opacity-90`} />
        
        {/* Animated Orbs (Hiệu ứng nền động) */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[100px]" />

        {/* Content Container */}
        <div className="relative z-10 max-w-xl w-full">
          {/* Badge Nổi bật */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-8 shadow-lg shadow-cyan-900/20 hover:bg-white/20 transition-all cursor-default">
            <Sparkles size={14} className="animate-pulse" /> 
            <span>EDUAPP LEARNING PLATFORM</span>
          </div>

          {/* Tiêu đề lớn */}
          <h1 className="text-5xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-2xl">
            Học tập <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Không giới hạn
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed font-light border-l-4 border-cyan-500 pl-6">
            Khám phá kho tàng tri thức, rèn luyện kỹ năng và kết nối với cộng đồng học tập toàn cầu ngay hôm nay.
          </p>

          {/* Stats Cards (Hiệu ứng kính mờ 3D) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-300">
                  <Users size={24} />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white">12k+</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Học viên</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 text-cyan-300">
                  <Trophy size={24} />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white">Top 1</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Chất lượng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="absolute bottom-10 left-12 text-slate-500 text-xs font-bold tracking-widest uppercase opacity-60">
          Made with ❤️ for Education
        </div>
      </div>

      {/* === RIGHT SIDE: FORM (SẠCH & HIỆN ĐẠI) === */}
      <div className="w-full lg:w-5/12 relative flex flex-col justify-center bg-white">
        
        {/* NÚT QUAY VỀ TRANG CHỦ (Góc trên trái) */}
        <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-20">
          <Link 
            to="/" 
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all duration-200 font-medium text-sm border border-slate-200/50 hover:border-slate-300"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Trang chủ</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] mx-auto px-6 py-12 lg:px-12">
          
          {/* Logo Mobile */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 transform rotate-3">
              <BookOpen size={28} />
            </div>
          </div>

          {/* Header (Thiết kế lại) */}
          <div className="mb-10">
            <div className="inline-block mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider border border-blue-100">
                Thành viên
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Chào mừng <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.textHighlight}`}>trở lại!</span>
            </h2>
            <p className="text-slate-500 text-base font-medium leading-relaxed">
              Cùng tiếp tục hành trình chinh phục tri thức. <br className="hidden xl:block"/>
              Nhập thông tin để truy cập không gian học tập.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tên đăng nhập</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-semibold transition-all duration-200 ${theme.inputFocus} outline-none focus:bg-white hover:bg-white hover:border-slate-300 pl-12`}
                  placeholder="Nhập username..."
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <User size={20} className="text-slate-400 group-focus-within:text-blue-600" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mật khẩu</label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-bold text-blue-600 hover:text-cyan-600 hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-semibold transition-all duration-200 ${theme.inputFocus} outline-none focus:bg-white hover:bg-white hover:border-slate-300 pl-12 pr-12`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <Lock size={20} className="text-slate-400 group-focus-within:text-blue-600" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-blue-200/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${theme.buttonGradient} mt-2`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Đăng Nhập Ngay</span>
                  <ArrowRight size={22} strokeWidth={2.5} />
                </div>
              )}
            </button>
          </form>

          {/* Footer Actions */}
          <div className="mt-10 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide font-bold text-slate-400">
                <span className="px-4 bg-white">Hoặc đăng nhập với</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              {['Google', 'Facebook', 'Github'].map((social) => (
                <button 
                  key={social}
                  className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all duration-200 shadow-sm"
                  title={`Login with ${social}`}
                >
                  <span className="font-bold text-xs">{social[0]}</span>
                </button>
              ))}
            </div>

            <p className="text-slate-600 text-sm font-medium">
              Bạn chưa có tài khoản?{' '}
              <Link 
                to="/register" 
                className="font-bold text-blue-600 hover:text-cyan-600 hover:underline transition-colors"
              >
                Đăng ký miễn phí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;