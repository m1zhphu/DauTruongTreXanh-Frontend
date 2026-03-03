import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../modules/admin/components/Sidebar';
import Topbar from '../modules/admin/components/Topbar';

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-gray-50 font-sans text-slate-900 overflow-hidden">
            {/* Sidebar cố định bên trái */}
            <Sidebar />
            
            {/* Khu vực nội dung chính */}
            <div className="flex-1 flex flex-col ml-64 min-w-0 transition-all duration-300">
                
                {/* Thanh Topbar dính trên cùng */}
                <Topbar />
                
                {/* Main Content: Full Width & Scrollable */}
                <main className="flex-1 overflow-y-auto p-8">
                    {/* [ĐÃ SỬA]: Xóa max-w-7xl mx-auto để nội dung tràn viền */}
                    <div className="w-full h-full"> 
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}