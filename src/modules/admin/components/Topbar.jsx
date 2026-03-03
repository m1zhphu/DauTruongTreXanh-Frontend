import React, { useState, useEffect } from "react";
import { User, Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const navigate = useNavigate();
    const [adminUser, setAdminUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Load thông tin Admin
    useEffect(() => {
        const loadAdmin = () => {
            const saved = localStorage.getItem("admin_user");
            if (saved) {
                try {
                    setAdminUser(JSON.parse(saved));
                } catch {
                    setAdminUser(null);
                }
            } else {
                setAdminUser(null);
            }
        };

        loadAdmin();
        // Lắng nghe sự kiện đăng nhập của admin
        window.addEventListener("adminLoginSuccess", loadAdmin);
        window.addEventListener("adminLogout", loadAdmin);

        return () => {
            window.removeEventListener("adminLoginSuccess", loadAdmin);
            window.removeEventListener("adminLogout", loadAdmin);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.dispatchEvent(new Event("adminLogout"));
        navigate("/admin/login");
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shadow-sm sticky top-0 z-30 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full w-1/3 max-w-md border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="Tìm kiếm dữ liệu..." className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400" />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-4 border border-transparent hover:border-gray-200 transition"
                    >
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                             {/* Hiển thị Avatar nếu có */}
                             {adminUser?.avatarUrl && adminUser.avatarUrl !== 'default_avatar.png' ? (
                                <img src={adminUser.avatarUrl} alt="Adm" className="w-full h-full object-cover"/>
                             ) : (
                                "AD"
                             )}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-gray-700 leading-none">
                                {adminUser?.name || adminUser?.username || "Admin"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">Quản trị viên</p>
                        </div>
                    </button>

                    {/* Admin Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95">
                            <div className="px-4 py-2 border-b border-gray-50">
                                <p className="text-xs text-gray-500">Đăng nhập với vai trò</p>
                                <p className="font-semibold text-gray-800 text-sm">{adminUser?.role}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut size={16} /> Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}