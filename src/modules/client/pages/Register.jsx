import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Mail, 
  Tag, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Sparkles,
  Rocket,
  Globe,
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import httpAxios from '../../../services/httpAxios';
/*import axios from 'axios';

 // --- CẤU HÌNH AXIOS (Giống Login) ---
const httpAxios = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
}); */
// ------------------------------------

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // --- THEME CONFIG ---
    const theme = {
        primaryGradient: "from-slate-900 via-slate-800 to-slate-900",
        buttonGradient: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
        inputFocus: "focus:ring-blue-500/20 focus:border-blue-500",
        textHighlight: "from-blue-600 to-cyan-500",
        bgImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" // Ảnh khác với Login 1 chút
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        try {
            const res = await httpAxios.post('/auth/register', formData);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                // Dispatch event để cập nhật header nếu cần
                window.dispatchEvent(new Event("clientLoginSuccess"));
                alert('Đăng ký thành công! Chào mừng bạn gia nhập.');
                navigate('/profile');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex font-sans bg-white overflow-hidden">
            {/* CSS fix */}
            <style>{`input::-ms-reveal, input::-ms-clear { display: none; }`}</style>

            {/* === LEFT SIDE: FORM (FORM BÊN TRÁI) === */}
            <div className="w-full lg:w-5/12 relative flex flex-col justify-center bg-white order-1">
                
                {/* NÚT QUAY VỀ HOME */}
                <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-20">
                    <Link 
                        to="/" 
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all duration-200 font-medium text-sm border border-slate-200/50 hover:border-slate-300"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span className="hidden sm:inline">Trang chủ</span>
                    </Link>
                </div>

                <div className="w-full max-w-[480px] mx-auto px-6 py-12 lg:px-12">
                    
                    {/* Logo Mobile */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 transform -rotate-3">
                            <BookOpen size={28} />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-block mb-3">
                            <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold uppercase tracking-wider border border-cyan-100">
                                Thành viên mới
                            </span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Tạo tài khoản <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.textHighlight}`}>mới</span>
                        </h2>
                        <p className="text-slate-500 text-base font-medium leading-relaxed">
                            Điền thông tin bên dưới để bắt đầu hành trình chinh phục tri thức cùng chúng tôi.
                        </p>
                    </div>

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-start gap-3 animate-in fade-in">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                            <p>{errorMsg}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* 1. Username */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tên đăng nhập</label>
                            <div className="relative group">
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-semibold transition-all duration-200 ${theme.inputFocus} outline-none focus:bg-white pl-12`}
                                    placeholder="Username"
                                    onChange={handleChange}
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={20} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Full Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tên hiển thị</label>
                            <div className="relative group">
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-semibold transition-all duration-200 ${theme.inputFocus} outline-none focus:bg-white pl-12`}
                                    placeholder="VD: Nguyễn Văn A"
                                    onChange={handleChange}
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Tag size={20} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-semibold transition-all duration-200 ${theme.inputFocus} outline-none focus:bg-white pl-12`}
                                    placeholder="example@email.com"
                                    onChange={handleChange}
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* 4. Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mật khẩu</label>
                            <div className="relative group">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-semibold transition-all duration-200 ${theme.inputFocus} outline-none focus:bg-white pl-12 pr-12`}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-blue-200/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${theme.buttonGradient} mt-4`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Đang tạo tài khoản...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Đăng Ký Ngay</span>
                                    <ArrowRight size={22} strokeWidth={2.5} />
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Footer Actions */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-600 text-sm font-medium">
                            Bạn đã có tài khoản rồi?{' '}
                            <Link 
                                to="/login" 
                                className="font-bold text-blue-600 hover:text-cyan-600 hover:underline transition-colors"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* === RIGHT SIDE: BANNER (BANNER BÊN PHẢI) === */}
            <div className="hidden lg:flex lg:w-7/12 relative bg-slate-900 items-center justify-center p-12 overflow-hidden group order-2">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-[60s] group-hover:scale-110"
                    style={{ backgroundImage: `url(${theme.bgImage})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.primaryGradient} opacity-90`} />
                
                {/* Animated Orbs */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px]" />

                {/* Content */}
                <div className="relative z-10 max-w-xl w-full text-right">
                    
                    <div className="flex justify-end mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-purple-300 shadow-lg cursor-default">
                            <Sparkles size={14} className="animate-spin-slow" /> 
                            <span>JOIN THE COMMUNITY</span>
                        </div>
                    </div>

                    <h1 className="text-5xl xl:text-7xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-2xl">
                        Khởi đầu <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 via-blue-400 to-purple-400">
                            Hành trình mới
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-300 mb-12 ml-auto max-w-md leading-relaxed font-light border-r-4 border-purple-500 pr-6">
                        Trở thành một phần của cộng đồng học tập năng động. Chia sẻ kiến thức, thi đấu và cùng nhau phát triển bản thân.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl text-left">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-emerald-300">
                                    <Rocket size={24} />
                                </div>
                                <div>
                                    <span className="block text-xl font-bold text-white">Tốc độ</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wide">Học nhanh hơn</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl text-left">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 text-purple-300">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <span className="block text-xl font-bold text-white">Kết nối</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wide">Toàn cầu</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 right-12 text-slate-500 text-xs font-bold tracking-widest uppercase opacity-60">
                    Your Future Starts Here
                </div>
            </div>
        </div>
    );
};

export default Register;