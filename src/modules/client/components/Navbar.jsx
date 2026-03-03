import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Loader2,
  Search,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  User,
  Gift,
  Home,
  BookOpen,
  BarChart2,
  Store,
  ChevronRight,
  Sparkles,
  Bell,
  LayoutGrid,
  Settings,
  Compass,
} from "lucide-react";
import httpAxios from "../../../services/httpAxios";
// Thêm import này để lấy base URL cho ảnh
import API_BASE_URL from "../../../services/apiConfig";

const Navbar = () => {
  // =========================================================================
  // LOGIC GIỮ NGUYÊN (DO NOT MODIFY LOGIC)
  // =========================================================================
  const navigate = useNavigate();
  const location = useLocation();

  const [menus, setMenus] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);

  const userDropdownRef = useRef(null);

  const getClientToken = () => localStorage.getItem("client_token");
  const getClientUser = () => {
    try {
      const userStr = localStorage.getItem("client_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const [currentUser, setCurrentUser] = useState(getClientUser());
  const [isLoggedIn, setIsLoggedIn] = useState(!!getClientToken());

  const fetchUserInfo = useCallback(async () => {
    const token = getClientToken();
    if (!token) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      return;
    }
    setIsLoggedIn(true);
    try {
      const res = await httpAxios.get(`/users/me?t=${new Date().getTime()}`);
      setCurrentUser(res.data);
      localStorage.setItem("client_user", JSON.stringify(res.data));
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
    window.addEventListener("clientLoginSuccess", fetchUserInfo);
    window.addEventListener("clientLogout", () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      navigate("/login");
    });
    return () => {
      window.removeEventListener("clientLoginSuccess", fetchUserInfo);
      window.removeEventListener("clientLogout", fetchUserInfo);
    };
  }, [fetchUserInfo, navigate]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await httpAxios.get("/menus");
        setMenus(res.data && res.data.length > 0 ? res.data : []);
      } catch {
        setMenus([
          { id: 1, name: "Trang chủ", link: "/", icon: <Home size={18} /> },
          {
            id: 2,
            name: "Chủ đề",
            link: "/topic",
            icon: <BookOpen size={18} />,
          },
          {
            id: 3,
            name: "BXH",
            link: "/leaderboard",
            icon: <BarChart2 size={18} />,
          },
        ]);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const handleClickOutside = (e) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      )
        setShowUserDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_user");
    window.dispatchEvent(new Event("clientLogout"));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSidebarOpen(false);
    }
  };

  // --- HÀM XỬ LÝ ẢNH NHANH (INLINE) ---
  // Logic: Nếu url có http -> giữ nguyên, nếu không -> nối với API_BASE_URL
  const resolveAvatar = (url) => {
    if (!url || url === "default_avatar.png")
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if (url.startsWith("http")) return url;
    // Loại bỏ /api ở cuối API_BASE_URL nếu có để tránh trùng
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${baseUrl}${url}`;
  };

  // =========================================================================
  // GIAO DIỆN MỚI (NEW UI DESIGN)
  // =========================================================================

  return (
    <>
      {/* Inline Styles cho Animation đặc biệt */}
      <style>{`
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .glass-nav-scrolled { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(226, 232, 240, 0.6); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03); }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled ? "glass-nav-scrolled py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* --- LEFT: LOGO & TRIGGER --- */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Sidebar Trigger Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="group relative p-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-90"
            >
              <span className="absolute inset-0 rounded-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <Menu
                size={26}
                strokeWidth={2.5}
                className="group-hover:text-emerald-600 transition-colors"
              />
            </button>

            {/* Logo Brand */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              onClick={() => navigate(isLoggedIn ? "/" : "/")}
            >
              <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/30"></div>
                <div className="absolute inset-[2px] bg-white rounded-[10px] flex items-center justify-center">
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-teal-800">
                    M
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-lg md:text-xl font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                  MinhPhu<span className="text-emerald-500">Edu</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                  Learning Platform
                </span>
              </div>
            </div>
          </div>

          {/* --- CENTER: SEARCH (DESKTOP) --- */}

          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-[480px] pointer-events-none opacity-0 lg:opacity-100 lg:pointer-events-auto transition-opacity duration-300">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Bạn muốn học gì hôm nay?"
                className="w-full bg-white border border-slate-100 rounded-full py-3.5 pl-6 pr-14 text-sm text-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300 active:scale-90"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSidebarOpen(true)} // Open sidebar to search on mobile
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Search size={22} />
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Market & Gacha Buttons (Desktop) */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => navigate("/market-place")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 group"
                  >
                    <Store
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-semibold text-sm">Chợ</span>
                  </button>
                  <button
                    onClick={() => navigate("/gacha")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 group"
                  >
                    <Gift
                      size={20}
                      className="group-hover:-rotate-12 transition-transform"
                    />
                    <span className="font-semibold text-sm">Gacha</span>
                  </button>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 group p-1 pr-3 rounded-full border border-slate-100 bg-white/50 hover:bg-white hover:shadow-md hover:border-emerald-100 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm relative">
                      {/* --- CHỈNH SỬA Ở ĐÂY: DÙNG HÀM RESOLVE AVATAR --- */}
                      {currentUser?.avatarUrl && !imageError ? (
                        <img
                          src={resolveAvatar(currentUser.avatarUrl)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={() => setImageError(true)}
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-700 max-w-[80px] truncate hidden lg:block">
                      {currentUser?.name?.split(" ").pop()}
                    </span>
                    <div
                      className={`transition-transform duration-300 ${
                        showUserDropdown ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronRight
                        size={14}
                        className="text-slate-400 rotate-90"
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-4 w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in-0 duration-200 origin-top-right ring-1 ring-slate-900/5 z-[60]">
                      {/* Header User Info */}
                      <div className="p-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 opacity-80"></div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0">
                            <img
                              src={resolveAvatar(currentUser?.avatarUrl)}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-lg truncate">
                              {currentUser?.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white shadow-md">
                                HV
                              </span>
                              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                <Sparkles size={10} fill="currentColor" />{" "}
                                {currentUser?.totalXp || 0} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-1 bg-white/50">
                        <button
                          onClick={() => navigate("/profile")}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-all group"
                        >
                          <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                            <User size={18} />
                          </div>
                          Hồ sơ cá nhân
                        </button>
                        <button
                          onClick={() => navigate("/profile/edit")}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl transition-all group"
                        >
                          <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                            <Settings size={18} />
                          </div>
                          Cài đặt tài khoản
                        </button>
                        <div className="h-px bg-slate-100 my-1 mx-3"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                        >
                          <div className="p-2 bg-white border border-red-100 rounded-lg shadow-sm text-red-400 group-hover:text-red-500 transition-colors">
                            <LogOut size={18} />
                          </div>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="hidden sm:inline-flex px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                >
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">Đăng ký</span>
                  <span className="sm:hidden">Đăng ký</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR OVERLAY ================= */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] transition-all duration-500 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 w-80 sm:w-96 h-full bg-white/95 backdrop-blur-2xl z-[70] shadow-2xl border-r border-white/20 transition-transform duration-500 cubic-bezier(0.33, 1, 0.68, 1) flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Decorative Background Blobs inside Sidebar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Sidebar Header */}
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-slate-100 rounded-lg">
                <LayoutGrid size={20} className="text-emerald-600" />
              </div>
              <span className="font-bold text-lg">Menu</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {isLoggedIn && (
            <div className="p-4 bg-white/60 border border-white rounded-2xl shadow-sm flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shadow-inner">
                <img
                  src={resolveAvatar(currentUser?.avatarUrl)}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
                  }
                />
              </div>
              <div>
                <p className="font-bold text-slate-800">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 font-medium">
                  @{currentUser?.username}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Body (Scrollable) */}
        <div className="flex-1 relative z-10 px-6 overflow-y-auto custom-scrollbar">
          {/* Search in Sidebar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>

          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Điều hướng chính
            </p>
            {loadingMenu ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-emerald-500" />
              </div>
            ) : (
              menus.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => {
                    navigate(item.link || item.url || "/");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group ${
                    location.pathname === (item.link || item.url)
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:pl-6"
                  }`}
                >
                  <span
                    className={`${
                      location.pathname === (item.link || item.url)
                        ? "text-white"
                        : "text-slate-400 group-hover:text-emerald-500"
                    }`}
                  >
                    {item.icon || <Compass size={18} />}
                  </span>
                  {item.name || item.title}
                  {location.pathname === (item.link || item.url) && (
                    <ChevronRight
                      size={16}
                      className="ml-auto text-emerald-100"
                    />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Functional Links */}
          <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Giải trí & Tiện ích
            </p>
            <button
              onClick={() => {
                navigate("/market-place");
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all hover:pl-6"
            >
              <Store size={18} className="text-slate-400" /> Chợ vật phẩm
            </button>
            <button
              onClick={() => {
                navigate("/gacha");
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-all hover:pl-6"
            >
              <Gift size={18} className="text-slate-400" /> Vòng quay may mắn
            </button>
            <button
              onClick={() => {
                navigate("/leaderboard");
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all hover:pl-6"
            >
              <BarChart2 size={18} className="text-slate-400" /> Bảng xếp hạng
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 relative z-10 border-t border-slate-100 bg-white/50 backdrop-blur-md">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl border border-red-100 text-red-600 bg-red-50/50 hover:bg-red-100/80 font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/login")}
                className="py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
