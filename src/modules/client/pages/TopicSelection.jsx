import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Star, Sparkles, Gamepad2, Key, X, Lock, User, CheckCircle } from 'lucide-react';

// ✅ 1. Import file cấu hình chung (Thay thế axios thường)
import httpAxios from '../../../services/httpAxios'; 

const TopicSelection = () => {
  const navigate = useNavigate();
  const [availableTopics, setAvailableTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE QUẢN LÝ MODAL & QUY TRÌNH THAM GIA ---
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Nhập mã, 2: Nhập tên
  
  // Dữ liệu bước 1
  const [joinData, setJoinData] = useState({ accessCode: '', password: '' });
  
  // Dữ liệu bước 2
  const [playerName, setPlayerName] = useState('');
  const [foundTopic, setFoundTopic] = useState(null); // Lưu thông tin lớp tìm được

  const [errorMsg, setErrorMsg] = useState('');
  const [checking, setChecking] = useState(false);

  // --- 1. GỌI API LẤY DANH SÁCH CHỦ ĐỀ CÔNG KHAI ---
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // ✅ 2. Dùng httpAxios và đường dẫn ngắn gọn
        const res = await httpAxios.get('/game/topics');
        if (res.data && Array.isArray(res.data)) {
          setAvailableTopics(res.data);
        }
      } catch (err) {
        console.error("Lỗi kết nối Backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleSelectTopic = (topicId) => {
    navigate(`/game/${topicId}`); // Chuyển hướng bằng ID
  };

  const handleCreateTopic = () => {
    navigate('/topic/create');
  };

  // Hàm reset modal khi đóng
  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);
    setJoinData({ accessCode: '', password: '' });
    setPlayerName('');
    setErrorMsg('');
    setFoundTopic(null);
  };

  // --- BƯỚC 1: KIỂM TRA MÃ LỚP ---
  const handleCheckCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setChecking(true);

    try {
      // ✅ 3. Dùng httpAxios và đường dẫn ngắn gọn
      const res = await httpAxios.post('/game/join', {
        code: joinData.accessCode, 
        password: joinData.password
      });
      
      // Nếu thành công: Lưu thông tin lớp và chuyển sang bước 2
      setFoundTopic(res.data); 
      setStep(2); 
      
    } catch (err) {
      console.error(err);
      // Lấy message lỗi chi tiết từ Backend trả về (nếu có)
      const message = err.response?.data?.message || err.response?.data || "Mã lớp hoặc mật khẩu không đúng!";
      setErrorMsg(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setChecking(false);
    }
  };

  // --- BƯỚC 2: XÁC NHẬN VÀO GAME ---
  const handleFinalJoin = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setErrorMsg("Vui lòng nhập tên của bạn!");
      return;
    }

    // Đóng modal
    handleCloseModal();

    // Chuyển hướng vào game, gửi kèm Tên người chơi qua state
    navigate(`/game/${foundTopic.id}`, { 
      state: { playerName: playerName } 
    });
  };

  return (
    <div className="min-h-full pb-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pt-8 relative">
       
       {/* Header Section */}
       <div className="max-w-7xl mx-auto mb-10 text-center space-y-4">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold shadow-sm mb-2 animate-fade-in">
           <Sparkles size={16} /> Thế giới tri thức đang chờ bạn
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 drop-shadow-sm">
           ĐẤU TRƯỜNG TRE XANH
         </h1>
         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Chọn chủ đề công khai, nhập mã lớp học, hoặc tự tạo bộ câu hỏi của riêng bạn.
         </p>

         <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button 
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-full shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 hover:border-orange-300 hover:text-orange-600 transition-all duration-300"
            >
                <Key size={20} className="text-orange-500" />
                Nhập Mã Lớp Học
            </button>

            <button 
                onClick={handleCreateTopic}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300"
            >
                <BookOpen size={20} />
                Tạo Chủ Đề Mới
            </button>
         </div>
       </div>

       {/* Grid Container */}
       <div className="max-w-7xl mx-auto">
         {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map((item) => (
               <div key={item} className="h-48 bg-gray-200 rounded-3xl animate-pulse"></div>
             ))}
           </div>
         ) : availableTopics.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-600">Chưa có chủ đề nào</h3>
                <p className="text-gray-500 mt-2">Hiện tại chưa có chủ đề công khai.</p>
                <button onClick={handleCreateTopic} className="mt-4 text-green-600 font-bold hover:underline">
                    + Tạo chủ đề đầu tiên
                </button>
            </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
             {availableTopics.map((topic, index) => (
               <div 
                 key={topic.id || index}
                 onClick={() => handleSelectTopic(topic.id)}
                 className="group relative bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:shadow-green-200/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
               >
                 <div className={`h-24 w-full bg-gradient-to-r ${getGradient(index)} relative`}>
                   <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md text-green-600 group-hover:scale-110 transition-transform duration-300">
                     <BookOpen size={32} className="group-hover:text-emerald-600" />
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-20 text-white">
                     <Gamepad2 size={48} />
                   </div>
                 </div>

                 <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2">
                        {topic.name}
                      </h3>
                      {topic.questionCount > 0 && (
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-md whitespace-nowrap">
                          {topic.questionCount} câu
                        </span>
                      )}
                   </div>
                   
                   <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                     Khám phá những câu hỏi thú vị về {topic.name} và tích lũy điểm tre xanh.
                   </p>

                   <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                     <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                       <Star size={14} fill="currentColor" />
                       <span>5.0</span>
                     </div>
                     <span className="flex items-center gap-1 text-sm font-bold text-green-600 group-hover:translate-x-1 transition-transform">
                       Vào chơi <ArrowRight size={16} />
                     </span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>

       <div className="text-center mt-8 border-t border-green-100 pt-8">
          <p className="text-green-800/60 text-sm font-medium">&copy; 2025 MinhPhuEdu Gaming Platform</p>
       </div>

       {/* --- MODAL (POPUP) 2 BƯỚC --- */}
       {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-scale-up">
                
                {/* Close Button */}
                <button 
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                {/* --- BƯỚC 1: NHẬP MÃ --- */}
                {step === 1 && (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Lớp Học Riêng Tư</h2>
                            <p className="text-gray-500 text-sm mt-2">Bước 1: Xác thực mã lớp</p>
                        </div>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium text-center border border-red-100">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleCheckCode} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mã lớp (Room ID)</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                                    placeholder="VD: LOP10A"
                                    value={joinData.accessCode}
                                    onChange={(e) => setJoinData({...joinData, accessCode: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium"
                                    placeholder="******"
                                    value={joinData.password}
                                    onChange={(e) => setJoinData({...joinData, password: e.target.value})}
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={checking}
                                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {checking ? 'Đang kiểm tra...' : 'Tiếp tục'}
                            </button>
                        </form>
                    </>
                )}

                {/* --- BƯỚC 2: NHẬP TÊN NGƯỜI CHƠI --- */}
                {step === 2 && foundTopic && (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Xác Nhận Tham Gia</h2>
                            <p className="text-green-600 font-bold mt-2 text-lg">
                                Lớp: {foundTopic.name}
                            </p>
                            <p className="text-gray-500 text-sm">Vui lòng nhập tên để giáo viên biết bạn</p>
                        </div>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium text-center border border-red-100">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleFinalJoin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tên của bạn</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all font-medium"
                                        placeholder="VD: Nguyễn Văn A"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 active:scale-[0.98] transition-all mt-2"
                            >
                                Vào Lớp Ngay
                            </button>
                            
                            <button 
                                type="button"
                                onClick={() => setStep(1)} // Quay lại bước 1
                                className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium"
                            >
                                Quay lại nhập mã
                            </button>
                        </form>
                    </>
                )}

            </div>
        </div>
       )}
    </div>
  );
};

const getGradient = (index) => {
  const gradients = [
    "from-green-400 to-emerald-500",
    "from-teal-400 to-cyan-500",
    "from-blue-400 to-indigo-500",
    "from-orange-400 to-amber-500",
    "from-pink-400 to-rose-500",
    "from-purple-400 to-violet-500",
  ];
  return gradients[index % gradients.length];
};

export default TopicSelection;