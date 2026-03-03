// src/modules/admin/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Settings, Gamepad2 } from 'lucide-react';

export default function Sidebar() {
    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Quản lý Chủ đề', path: '/admin/topics', icon: <BookOpen size={20} /> },
        { name: 'Ngân hàng câu hỏi', path: '/admin/questions', icon: <FileText size={20} /> },
        { name: 'Sự kiện', path: '/admin/events', icon: <FileText size={20} /> },
        { name: 'Bản Đồ', path: '/admin/region', icon: <FileText size={20} /> },
        { name: 'Người dùng', path: '/admin/users', icon: <FileText size={20} /> },
        { name: 'Vật phẩm', path: '/admin/gachas', icon: <FileText size={20} /> },
        { name: 'Đài Phát Thanh', path: '/admin/radio', icon: <FileText size={20} /> },
    ];

    const linkStyle = "flex items-center gap-3 rounded-xl py-3 px-4 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600";
    const activeLinkStyle = "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 hover:text-white";

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-xl">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    A
                </div>
                <h1 className="text-xl font-bold text-gray-800">Admin<span className="text-blue-600">Panel</span></h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <NavLink to="/" className="flex items-center gap-3 w-full rounded-xl py-3 px-4 text-gray-600 hover:bg-gray-50 transition-colors">
                    <Gamepad2 size={20} />
                    <span className="font-medium">Về trang Game</span>
                </NavLink>
            </div>
        </aside>
    );
}