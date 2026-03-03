import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, Play, Zap, Target, Users, Star, 
  CheckCircle, Sparkles, Trophy, Rocket, 
  ChevronDown, BookOpen, Map, Gamepad2, Radio, 
  Sword, Clock, GraduationCap, Headphones, Palette,
  BarChart3, Award, Flame, Music, Gift, Disc, MapPin
} from "lucide-react";
import Navbar from "../components/Navbar"; 
import bannerImage from '../../../assets/banner.png'; 

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]); 

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-[#F8FAFC] selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      
      <Navbar />

      {/* ================= 1. HERO SECTION (IMPACTFUL) ================= */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
              {/* Abstract Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                  <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] animate-blob"></div>
                  <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-20"></div>
              </div>
      
              <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  
                  {/* Left Content */}
                  <motion.div 
                    className="lg:w-1/2 text-center lg:text-left z-20"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-emerald-100 shadow-sm mb-8 hover:shadow-md transition-shadow cursor-default">
                       <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                       </span>
                       <span className="text-emerald-800 text-xs font-bold tracking-widest uppercase">Nền tảng giáo dục 4.0</span>
                    </motion.div>
      
                    <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
                      Đánh thức <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                        Thánh Gióng
                      </span> <br/>
                      trong bạn.
                    </motion.h1>
                    
                    <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium mb-10">
                      Hệ thống học tập thông minh kết hợp Gamification. Biến mỗi bài học thành một trận chiến, mỗi kiến thức thành vũ khí để chinh phục tương lai.
                    </motion.p>
                    
                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                      <button 
                        onClick={() => navigate("/register")} 
                        className="group relative w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:-translate-y-1 transition-all overflow-hidden"
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative flex items-center justify-center gap-2">
                          Tham gia ngay <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => navigate("/tutorial")}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Play size={18} className="fill-current" /> Xem Demo
                      </button>
                    </motion.div>
      
                    {/* Social Proof */}
                    <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center lg:justify-start gap-4">
                       <div className="flex -space-x-3">
                          {[1,2,3,4].map(i => (
                              <div key={i} className="w-10 h-10 rounded-full border-[3px] border-slate-50 bg-slate-200 overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i+5}`} alt="User" />
                              </div>
                          ))}
                          <div className="w-10 h-10 rounded-full border-[3px] border-slate-50 bg-slate-900 text-white flex items-center justify-center text-xs font-bold">+2k</div>
                       </div>
                       <div className="text-sm">
                          <div className="flex text-amber-400 mb-0.5">
                              {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="currentColor" />)}
                          </div>
                          <p className="text-slate-500 font-medium">Được yêu thích bởi học sinh</p>
                       </div>
                    </motion.div>
                  </motion.div>
      
                  {/* Right Visual (3D & Glass) */}
                  <motion.div 
                    className="lg:w-1/2 relative z-10"
                    style={{ y: heroY }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="relative">
                        {/* Backdrop Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-200 to-teal-100 rounded-full blur-[60px] opacity-60"></div>
                        
                        {/* Main Image */}
                        <img 
                          src={bannerImage} 
                          alt="Hero Mascot" 
                          className="w-full max-w-[600px] mx-auto drop-shadow-2xl relative z-10 animate-float-slow" 
                        />
      
                        {/* Floating Elements (Glassmorphism) */}
                        <FloatingCard 
                          className="absolute top-10 -left-4 md:left-0"
                          icon={<Trophy size={24} className="text-amber-500" />}
                          title="Top 1 Server"
                          subtitle="Xếp hạng tuần"
                          delay={0}
                        />
                        
                        <FloatingCard 
                          className="absolute bottom-20 -right-4 md:right-10"
                          icon={<CheckCircle size={24} className="text-emerald-500" />}
                          title="Hoàn thành"
                          subtitle="300+ Bài tập"
                          delay={1.5}
                        />
      
                        {/* Decorative 3D shapes - CSS Icon replacement */}
                        <motion.div 
                          className="absolute -top-10 right-0 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/40 rotate-12 z-20 backdrop-blur-sm"
                          animate={{ y: [0, -10, 0], rotate: [12, 20, 12] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <BookOpen size={36} className="text-white drop-shadow-md" />
                        </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

      {/* ================= 2. FEATURE ECOSYSTEM (UPDATED VERSION) ================= */}
      <section className="py-24 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] border-t border-slate-100">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs tracking-wider uppercase mb-6 border border-slate-200">
                        <Sparkles size={14} className="text-amber-500"/> Hệ Sinh Thái
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                        Chọn hành trình <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Khám Phá Của Bạn</span>
                    </h2>
                    <p className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto">
                        Mỗi tính năng là một cánh cửa mở ra thế giới tri thức. Từ ôn luyện chuyên sâu đến giải trí nhẹ nhàng.
                    </p>
                </motion.div>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[minmax(250px,auto)]">
                
                {/* --- 1. TOPICS (Đấu Trường Tre Xanh) - UPDATED MODERN LOOK --- */}
                <motion.div 
                    onClick={() => navigate('/topic')}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.15)" }}
                    className="md:col-span-8 bg-[#F0FDF4] rounded-[2.5rem] p-10 relative overflow-hidden group cursor-pointer shadow-lg border border-emerald-100"
                >
                    {/* Abstract Nature Pattern */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/leaves.png')] opacity-10 mix-blend-multiply"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/40 rounded-full blur-[80px] group-hover:bg-emerald-300/40 transition-colors"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-10 h-full items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-lg border border-emerald-200">
                                <Flame size={12} className="fill-emerald-700"/> Hot Topic
                            </div>
                            
                            <div>
                                <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors tracking-tight">
                                    Đấu Trường Tre Xanh
                                </h3>
                                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                    Thử thách kiến thức đa lĩnh vực. Tích lũy điểm "Lá Tre" để đổi quà và leo hạng.
                                </p>
                            </div>

                            {/* Tags with Icons */}
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-600 border border-emerald-100 shadow-sm flex items-center gap-2 group-hover:scale-105 transition-transform">
                                    🏛️ Lịch Sử
                                </span>
                                <span className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-600 border border-emerald-100 shadow-sm flex items-center gap-2 group-hover:scale-105 transition-transform delay-75">
                                    🌏 Địa Lý
                                </span>
                                <span className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-600 border border-emerald-100 shadow-sm flex items-center gap-2 group-hover:scale-105 transition-transform delay-150">
                                    🎭 Văn Hóa
                                </span>
                            </div>
                        </div>

                        {/* Interactive 3D Stack Mockup */}
                        <div className="flex-1 w-full flex justify-center perspective-1000">
                            <div className="relative w-64 h-64">
                                {/* Card 3 */}
                                <div className="absolute top-0 right-0 w-full h-full bg-white p-6 rounded-3xl shadow-sm border border-emerald-50 rotate-12 scale-90 opacity-60 transition-all duration-500 group-hover:rotate-[15deg] group-hover:translate-x-8"></div>
                                {/* Card 2 */}
                                <div className="absolute top-0 right-0 w-full h-full bg-white p-6 rounded-3xl shadow-md border border-emerald-100 rotate-6 scale-95 opacity-80 transition-all duration-500 group-hover:rotate-[8deg] group-hover:translate-x-4"></div>
                                {/* Card 1 (Main) */}
                                <div className="absolute top-0 right-0 w-full h-full bg-white p-6 rounded-3xl shadow-xl border border-emerald-200 z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                            <BookOpen size={24} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Tiến độ</div>
                                            <div className="text-lg font-black text-emerald-600">85%</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 w-3/4 bg-slate-100 rounded-full"></div>
                                        <div className="h-3 w-1/2 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Level 5</span>
                                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-emerald-200">Tiếp tục</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- 2. GAME & GACHA (Giữ nguyên từ lần sửa trước vì đã hiện đại) --- */}
                <motion.div 
                    onClick={() => navigate('/quiz/join')}
                    whileHover={{ y: -8, scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className="md:col-span-4 md:row-span-2 bg-[#090E1A] rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer shadow-2xl flex flex-col border border-indigo-500/20"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-[150px] animate-blob"></div>
                    <div className="absolute bottom-[-50%] right-[-50%] w-full h-full bg-gradient-to-tl from-fuchsia-600/30 to-pink-600/30 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/0 via-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all duration-500">
                                <Gamepad2 size={28} className="animate-pulse-slow" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-indigo-500/20 mb-1">
                                    Multiplayer
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>

                        <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Game & Gacha</h3>
                        <p className="text-indigo-200 mb-10 text-sm leading-relaxed font-medium">
                            Đấu trí trực tiếp (Kahoot style). Tích lũy điểm để quay thưởng nhân vật giới hạn.
                        </p>

                        <div className="mt-auto relative">
                            <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-32 h-32 pointer-events-none">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 blur-xl opacity-40 animate-pulse-slow"></div>
                                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-[2s] ease-in-out">
                                    <Gift size={40} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 pt-16 text-center relative group-hover:border-indigo-400/50 transition-all duration-500">
                                <div className="text-white font-bold text-lg mb-2">Sẵn sàng chưa?</div>
                                <div className="flex gap-3 justify-center mb-6">
                                    <span className="px-3 py-1 rounded-lg bg-indigo-900/50 border border-indigo-500/30 text-xs text-indigo-300 font-bold">Quiz</span>
                                    <span className="px-3 py-1 rounded-lg bg-pink-900/50 border border-pink-500/30 text-xs text-pink-300 font-bold">Lucky Draw</span>
                                </div>
                                <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-base tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 relative overflow-hidden group/btn">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        THAM GIA NGAY <Sparkles size={18} />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- 3. MAP (Hành trình xuyên Việt) - UPDATED PASSPORT STYLE --- */}
                <motion.div 
                    onClick={() => navigate('/vietnam-map')}
                    whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="md:col-span-4 bg-[#EFF6FF] rounded-[2.5rem] p-8 border border-blue-100 relative overflow-hidden group cursor-pointer shadow-lg"
                >
                    {/* Topography Map Background */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/topography.png')] opacity-10"></div>
                    
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-blue-600 flex items-center justify-center group-hover:rotate-[-10deg] transition-transform duration-300 border border-blue-50">
                                <Map size={28} />
                            </div>
                            <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-200">
                                35/63 Tỉnh
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Hành Trình Xuyên Việt</h3>
                        <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                            Mở khóa 63 tỉnh thành. Sưu tập tem du lịch qua từng bài học.
                        </p>

                        {/* Interactive 3D Map Visual */}
                        <div className="mt-auto relative w-full h-40 bg-white/60 rounded-3xl backdrop-blur-sm border border-white/60 shadow-inner flex items-center justify-center overflow-hidden group-hover:bg-white/80 transition-colors">
                            {/* Vietnam Map Silhouette */}
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/2560px-Flag_of_Vietnam.svg.png" 
                                 alt="VN" 
                                 className="absolute h-[140%] object-cover opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700 blur-[1px]" 
                            />
                            
                            {/* Floating Pins */}
                            <div className="relative z-10 flex gap-4">
                                <motion.div 
                                    animate={{ y: [0, -5, 0] }} 
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="flex flex-col items-center"
                                >
                                    <MapPin size={24} className="text-red-500 fill-red-500 drop-shadow-md"/>
                                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow-sm mt-1">Hà Nội</span>
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, -5, 0] }} 
                                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                                    className="flex flex-col items-center"
                                >
                                    <MapPin size={24} className="text-blue-500 fill-blue-500 drop-shadow-md"/>
                                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow-sm mt-1">Đà Nẵng</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- 4. RADIO (Đài phát thanh) - UPDATED VINYL PLAYER STYLE --- */}
                <motion.div 
                    onClick={() => navigate('/radio')}
                    whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.15)" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="md:col-span-4 bg-[#FFFBEB] rounded-[2.5rem] p-8 border border-amber-100 relative overflow-hidden group cursor-pointer shadow-lg flex flex-col"
                >
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-amber-600 flex items-center justify-center border border-amber-50 group-hover:scale-110 transition-transform">
                                <Headphones size={28} />
                            </div>
                            {/* Sound Wave Animation */}
                            <div className="flex gap-1 h-8 items-end">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-1.5 bg-amber-400 rounded-full animate-bounce-custom" style={{ height: `${30 + Math.random() * 70}%`, animationDuration: `${0.6 + Math.random() * 0.4}s` }}></div>
                                ))}
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">Đài Phát Thanh</h3>
                        <p className="text-slate-600 text-sm mb-6">
                            Podcast lịch sử & âm nhạc dân gian thư giãn.
                        </p>

                        {/* Vinyl Player UI */}
                        <div className="mt-auto bg-amber-100/50 rounded-3xl p-4 flex items-center gap-4 border border-amber-200/50 backdrop-blur-sm group-hover:bg-white group-hover:shadow-md transition-all">
                            {/* Spinning Vinyl */}
                            <div className="w-16 h-16 rounded-full bg-slate-900 relative flex-shrink-0 animate-spin-slow shadow-lg border-2 border-slate-800">
                                <div className="absolute inset-[30%] border border-slate-700 rounded-full"></div>
                                <div className="absolute inset-[35%] bg-amber-500 rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                </div>
                            </div>
                            
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Live FM 99.9</span>
                                </div>
                                <div className="text-sm font-bold text-slate-900 truncate">Sử Việt Hùng Tráng</div>
                                <div className="text-xs text-slate-500 truncate">Tập 12: Hào Khí Đông A</div>
                            </div>

                            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform">
                                <Play size={16} fill="currentColor" className="ml-0.5"/>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- 5. EVENTS (Sự kiện tranh tài) - Giữ nguyên từ lần sửa trước --- */}
                <motion.div 
                    onClick={() => navigate('/events')}
                    whileHover={{ y: -5, scale: 1.01 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="md:col-span-12 bg-gradient-to-r from-slate-900 via-red-900 to-slate-900 rounded-[2rem] p-1 relative overflow-hidden group cursor-pointer shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50 blur-xl group-hover:opacity-80 transition-opacity animate-pulse-slow"></div>
                    
                    <div className="relative h-full bg-slate-900/90 backdrop-blur-xl rounded-[1.9rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    <Sword size={40} />
                                </div>
                                <div className="absolute -bottom-2 -right-2">
                                    <Flame size={24} className="text-orange-400 drop-shadow-lg animate-bounce-custom" />
                                </div>
                            </div>
                            
                            <div className="flex-1 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-black tracking-tight uppercase">Đấu Trường Rực Lửa</h3>
                                    <span className="px-3 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded-full border border-red-400 animate-pulse">
                                        LIVE NOW
                                    </span>
                                </div>
                                <p className="text-slate-300 font-medium">
                                    Tham gia đại chiến thời gian thực. Leo bảng xếp hạng, nhận danh hiệu và quà tặng giới hạn.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end bg-white/5 px-6 py-4 rounded-2xl border border-white/10 group-hover:border-red-500/50 transition-all">
                            <div className="flex flex-col gap-2 pr-6 border-r border-white/10">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                    <Award size={14} className="text-yellow-500" /> Top 1: <span className="text-white">MinhPhu_Pro</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <span className="w-3.5 text-center">2</span> <span className="text-slate-300">HocBaDi_99</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Đang online</div>
                                <div className="text-3xl font-black text-white flex items-center gap-2">
                                    <Users size={24} className="text-red-500" />
                                    500+
                                </div>
                            </div>
                            
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-red-600 transition-colors shadow-lg shadow-red-600/20 group-hover:scale-110 ml-4">
                                <ArrowRight size={24} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
      </section>

      {/* ================= 3. PARTNERS (Giữ nguyên) ================= */}
      <section className="py-10 border-y border-slate-200 bg-white overflow-hidden">
        <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">Đồng hành cùng các đơn vị giáo dục</p>
        <div className="relative flex overflow-x-hidden group">
           <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
               {[...Array(4)].map((_, i) => (
                   <React.Fragment key={i}>
                       <span className="text-2xl font-black text-slate-300">MinhPhu<span className="text-slate-400">Edu</span></span>
                       <span className="text-2xl font-black text-slate-300">SCHOOL<span className="text-slate-400">X</span></span>
                       <span className="text-2xl font-black text-slate-300">FUTURE<span className="text-slate-400">LEARN</span></span>
                       <span className="text-2xl font-black text-slate-300">KNOWLEDGE<span className="text-slate-400">HUB</span></span>
                       <span className="text-2xl font-black text-slate-300">VIET<span className="text-slate-400">HISTORY</span></span>
                   </React.Fragment>
               ))}
           </div>
        </div>
      </section>

      {/* ================= 4. VALUE PROPOSITION (Giữ nguyên) ================= */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6">
              Học tập <span className="text-emerald-600">thông minh</span> hơn.
            </h2>
            <p className="text-slate-500 text-lg">
              Kết hợp công nghệ AI và phương pháp sư phạm hiện đại để tối ưu hóa thời gian học tập của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
                <div className="relative z-10 max-w-md">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                        <Zap size={28} fill="currentColor"/>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Ghi nhớ siêu tốc với Spaced Repetition</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Hệ thống tự động tính toán "điểm rơi của sự quên lãng" để nhắc bạn ôn tập đúng lúc. Biến trí nhớ ngắn hạn thành dài hạn chỉ với 15 phút mỗi ngày.
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-amber-50 to-transparent opacity-50 pointer-events-none"></div>
            </motion.div>

            <motion.div 
              className="md:row-span-2 bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-xl border border-slate-800 relative overflow-hidden group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/30">
                        <Target size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Cá nhân hóa lộ trình</h3>
                    <p className="text-slate-400 leading-relaxed mb-8">
                        AI sẽ phân tích điểm mạnh, điểm yếu của bạn để đề xuất lộ trình học tập độc bản. Không còn học lan man.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
                            <CheckCircle size={20} className="text-emerald-400" />
                            <span className="text-sm font-medium">Lịch sử Việt Nam</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
                            <CheckCircle size={20} className="text-emerald-400" />
                            <span className="text-sm font-medium">Văn hóa dân gian</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <Users size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Cộng đồng sôi nổi</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Thi đấu, leo bảng xếp hạng và trao đổi kiến thức. Học một mình thì nhanh, học cùng bạn thì vui.
                    </p>
                </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-[2.5rem] p-10 shadow-xl shadow-emerald-500/30 relative overflow-hidden group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                        <Rocket size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Nội dung chuẩn</h3>
                    <p className="text-emerald-50 leading-relaxed">
                        100% bài học được biên soạn bởi đội ngũ chuyên gia, đảm bảo chính xác và hấp dẫn.
                    </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= 5. STATS SECTION (Giữ nguyên) ================= */}
      <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
                  <StatItem number="500+" label="Chủ đề bài học" delay={0} />
                  <StatItem number="10K+" label="Câu hỏi trắc nghiệm" delay={0.1} />
                  <StatItem number="24/7" label="Truy cập mọi nơi" delay={0.2} />
                  <StatItem number="4.9/5" label="Đánh giá từ người dùng" delay={0.3} />
              </div>
          </div>
      </section>

      {/* ================= 6. FAQ (Giữ nguyên) ================= */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
                <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Hỗ trợ</span>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-2">Câu hỏi thường gặp</h2>
            </div>
            
            <div className="space-y-4">
                <AccordionItem 
                    title="Nội dung trên web phù hợp với lứa tuổi nào?"
                    content="MinhPhuEdu phù hợp cho mọi lứa tuổi, từ học sinh cấp 1 muốn tìm hiểu lịch sử qua hình ảnh trực quan, đến sinh viên và người đi làm muốn củng cố kiến thức xã hội."
                />
                <AccordionItem 
                    title="Tôi có cần trả phí để học không?"
                    content="Phần lớn các chủ đề cơ bản đều miễn phí trọn đời. Các chủ đề chuyên sâu và tính năng nâng cao (như thống kê chi tiết) sẽ nằm trong gói Premium với chi phí rất nhỏ."
                />
                <AccordionItem 
                    title="Làm sao để tôi theo dõi tiến độ học tập?"
                    content="Hệ thống Dashboard cá nhân sẽ hiển thị chi tiết biểu đồ học tập, số câu đúng/sai, chuỗi ngày học liên tiếp (Streak) và thứ hạng của bạn so với cộng đồng."
                />
            </div>
        </div>
      </section>

      {/* ================= 7. CTA SECTION (Giữ nguyên) ================= */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white py-20 px-6 md:px-20 text-center shadow-2xl shadow-slate-900/40">
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3 hover:rotate-6 transition-transform">
                      <Sparkles size={40} className="text-white" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    Sẵn sàng trở thành <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Thánh Gióng</span> thời đại mới?
                  </h2>
                  <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
                    Tham gia cộng đồng 12,000+ người học thông minh ngay hôm nay. Hoàn toàn miễn phí để bắt đầu.
                  </p>
                  
                  <button 
                    onClick={() => navigate("/register")}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-xl hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  >
                    Đăng ký miễn phí <ArrowRight size={24} />
                  </button>
                  <p className="mt-6 text-sm text-slate-500">Không cần thẻ tín dụng. Hủy bất cứ lúc nào.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER (Giữ nguyên) ================= */}
      <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                      E
                    </div>
                    <span className="font-bold text-2xl text-slate-900">EduApp</span>
                </div>
                <p className="text-slate-500 max-w-sm leading-relaxed">
                    Nền tảng học tập tương tác hàng đầu Việt Nam. Chúng tôi tin rằng giáo dục là vũ khí mạnh nhất để thay đổi thế giới.
                </p>
            </div>
            
            <div>
                <h4 className="font-bold text-slate-900 mb-4">Sản phẩm</h4>
                <ul className="space-y-2 text-slate-500">
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Chủ đề</a></li>
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Bảng xếp hạng</a></li>
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Premium</a></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-bold text-slate-900 mb-4">Công ty</h4>
                <ul className="space-y-2 text-slate-500">
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Về chúng tôi</a></li>
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Liên hệ</a></li>
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Điều khoản</a></li>
                </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm font-medium">&copy; 2025 MinhPhuEdu. All rights reserved.</p>
            <div className="flex gap-6">
                <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-emerald-100 cursor-pointer transition-colors"></div>
                <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-emerald-100 cursor-pointer transition-colors"></div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style>{`
        @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite; }
        
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }

        .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes bounce-custom {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.5); }
        }
        .animate-bounce-custom { animation: bounce-custom 1s ease-in-out infinite; }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const FloatingCard = ({ icon, title, subtitle, className, delay }) => (
  <motion.div 
    className={`flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-xl ${className}`}
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 4, delay: delay, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{subtitle}</p>
      <p className="text-slate-900 font-bold">{title}</p>
    </div>
  </motion.div>
);

const StatItem = ({ number, label, delay }) => (
  <motion.div 
    className="text-center p-4"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
  >
    <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">{number}</h3>
    <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">{label}</p>
  </motion.div>
);

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button 
                className="w-full flex justify-between items-center p-6 text-left font-bold text-slate-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg">{title}</span>
                <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-6 pb-6 text-slate-500 leading-relaxed">
                    {content}
                </p>
            </div>
        </div>
    );
};

export default LandingPage;