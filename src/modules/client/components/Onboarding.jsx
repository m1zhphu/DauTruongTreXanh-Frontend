import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, ChevronLeft, Sprout, AlertTriangle, RotateCcw, Flag, Zap, Stars } from "lucide-react";

// --- IMPORT ẢNH ---
import guideImage0 from '../../../assets/b0.png';
import guideImage1 from '../../../assets/b1.png';
import guideImage2 from '../../../assets/b2.png';
import guideImage3 from '../../../assets/b3.png';
import guideImage4 from '../../../assets/b4.png';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Thêm style animation trực tiếp
  const floatAnimation = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
    @keyframes pulse-glow {
      0% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
      100% { opacity: 0.5; transform: scale(1); }
    }
  `;

  const steps = [
    {
      id: 1,
      title: "Chào mừng chiến binh Thánh Gióng!",
      description: "Trang bị kiến thức như mặc giáp sắt. Rèn luyện trí não mỗi ngày để sẵn sàng chinh phục mọi thử thách.",
      image: guideImage0,
      // Dùng gradient thay vì màu đơn sắc để tạo độ sâu
      bgGradient: "from-blue-600 via-blue-500 to-indigo-900",
      accentColor: "text-blue-600",
      buttonColor: "bg-blue-600 shadow-blue-500/40",
      icon: <Flag className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
    },
    {
      id: 2,
      title: "Trả lời đúng: Tưới tắm mầm xanh",
      description: "Mỗi câu trả lời ĐÚNG là một gáo nước mát lành giúp măng non sinh trưởng.",
      image: guideImage1,
      bgGradient: "from-green-500 via-emerald-500 to-green-900",
      accentColor: "text-green-600",
      buttonColor: "bg-green-600 shadow-green-500/40",
      icon: <Sprout className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
    },
    {
      id: 3,
      title: "Tích lũy đốt tre: Vươn tới trời xanh",
      description: "Tre mọc thêm đốt mới sau mỗi lần tưới. Cây càng cao, kiến thức càng vững.",
      image: guideImage2,
      bgGradient: "from-emerald-400 via-teal-500 to-emerald-900",
      accentColor: "text-emerald-500",
      buttonColor: "bg-emerald-500 shadow-emerald-500/40",
      icon: <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
    },
    {
      id: 4,
      title: "Cẩn thận: Sai lầm là gãy đổ!",
      description: "Chỉ một câu trả lời SAI, cây tre sẽ bị lung lay và gãy khúc. Streak sẽ bị mất.",
      image: guideImage3,
      bgGradient: "from-red-500 via-rose-500 to-red-900",
      accentColor: "text-red-500",
      buttonColor: "bg-red-500 shadow-red-500/40",
      icon: <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
    },
    {
      id: 5,
      title: "Đừng bỏ cuộc: Làm lại từ đầu",
      description: "Thất bại là mẹ thành công. Nếu tre đổ, hãy quay lại Checkpoint để trồng lại cây tre mới!",
      image: guideImage4,
      bgGradient: "from-orange-400 via-orange-500 to-amber-900",
      accentColor: "text-orange-500",
      buttonColor: "bg-orange-500 shadow-orange-500/40",
      icon: <RotateCcw className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
    }
  ];

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            navigate("/topic");
        }
        setIsAnimating(false);
    }, 400); // Tăng nhẹ thời gian delay để mượt hơn
  };

  const handleBack = () => {
    if (currentStep > 0 && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentStep(prev => prev - 1);
            setIsAnimating(false);
        }, 400);
    }
  };

  const currentData = steps[currentStep];

  return (
    <div className="h-[100dvh] w-full bg-white font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* Inject Style cho Animation */}
      <style>{floatAnimation}</style>
      
      {/* --- CỘT TRÁI: VISUAL ART (45% Mobile, 55% Desktop) --- */}
      <div className={`relative h-[45%] lg:h-full lg:w-[55%] overflow-hidden transition-all duration-700 ease-in-out`}>
         
         {/* 1. Dynamic Background với Gradient Spotlight */}
         <div className={`absolute inset-0 bg-gradient-to-br ${currentData.bgGradient} transition-colors duration-700`}></div>
         
         {/* 2. Họa tiết trang trí (Circles/Orbs) */}
         <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/10 rounded-full blur-[80px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-black/20 rounded-full blur-[100px]"></div>

         {/* Nút Skip Mobile */}
         <button onClick={() => navigate("/app")} className="absolute top-4 right-4 lg:hidden text-white/80 font-medium z-30 text-xs px-4 py-2 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">
            Bỏ qua
         </button>

         {/* 3. Vùng chứa ảnh chính (Hero Section) */}
         <div className="relative z-10 w-full h-full flex items-center justify-center p-6 lg:p-16">
            
            {/* Wrapper Animation chuyển cảnh */}
            <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${isAnimating ? 'opacity-0 scale-90 translate-y-8' : 'opacity-100 scale-100 translate-y-0'}`}>
                
                {/* GLASS POD: Lớp kính mờ phía sau */}
                <div className="absolute w-[85%] aspect-square max-h-[350px] lg:max-h-[500px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[3rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] flex items-center justify-center transform rotate-[-2deg]">
                   {/* Inner Glow Ring */}
                   <div className="absolute inset-4 border border-white/10 rounded-[2.5rem]"></div>
                </div>

                {/* Decorative Sparkles */}
                <Stars className="absolute top-[15%] right-[20%] text-yellow-300 w-8 h-8 opacity-80 animate-bounce" style={{ animationDuration: '3s' }} />
                <div className="absolute bottom-[20%] left-[20%] w-3 h-3 bg-white rounded-full opacity-60 animate-ping"></div>

                {/* MAIN IMAGE với hiệu ứng Floating */}
                <div 
                    className="relative w-full h-full flex items-center justify-center z-20"
                    style={{ animation: 'float 6s ease-in-out infinite' }}
                >
                    <img 
                        src={currentData.image} 
                        alt="Minh họa" 
                        className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] filter brightness-105"
                    />
                </div>
            </div>
         </div>
         
         {/* Curve Divider cho Mobile (Tạo đường cong nối với phần trắng bên dưới) */}
         <div className="absolute bottom-0 left-0 w-full h-8 bg-white rounded-t-[2rem] lg:hidden z-20 translate-y-4"></div>
      </div>

      {/* --- CỘT PHẢI: CONTENT (55% Mobile, 45% Desktop) --- */}
      <div className="flex-1 lg:w-[45%] lg:h-full bg-white flex flex-col relative z-20 pt-2 lg:pt-0">
         
         {/* Nút Skip Desktop */}
         <button 
            onClick={() => navigate("/topic")} 
            className="hidden lg:block absolute top-10 right-10 text-gray-400 hover:text-gray-800 font-bold text-sm transition hover:bg-gray-100 px-4 py-2 rounded-lg"
         >
            Bỏ qua hướng dẫn
         </button>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto px-6 lg:px-20 py-4 flex flex-col justify-center">
             <div className={`transition-all duration-500 ease-out ${isAnimating ? 'opacity-0 translate-x-12' : 'opacity-100 translate-x-0'}`}>
                
                {/* Icon Badge */}
                <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl ${currentData.buttonColor} flex items-center justify-center shadow-lg mb-6 lg:mb-8`}>
                   {currentData.icon}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 lg:mb-6 leading-[1.2]">
                   {currentData.title}
                </h1>
                
                {/* Description with colored accent */}
                <p className="text-base lg:text-lg text-gray-500 leading-relaxed font-medium">
                   {currentData.description}
                </p>
             </div>
         </div>

         {/* Footer Area */}
         <div className="shrink-0 px-6 pb-8 lg:px-20 lg:pb-16 bg-white">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-6 lg:mb-10">
               {steps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 lg:h-2 rounded-full flex-1 transition-all duration-500 ${idx <= currentStep ? currentData.buttonColor : 'bg-gray-100'}`}
                  ></div>
               ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
               <button 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center transition-all duration-300 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 text-gray-600'}`}
               >
                  <ChevronLeft size={24} />
               </button>

               <button 
                  onClick={handleNext}
                  className={`flex-1 h-12 lg:h-14 rounded-full font-bold text-white text-base lg:text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 ${currentData.buttonColor}`}
               >
                  {currentStep === steps.length - 1 ? (
                      <>Bắt đầu ngay <Check size={20} strokeWidth={3} /></>
                  ) : (
                      <>Tiếp tục <ArrowRight size={20} strokeWidth={3} /></>
                  )}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Onboarding;