// File: ClientLayout.jsx (Đã sửa lỗi padding-top)
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../modules/client/components/Navbar'; // Giả sử Navbar nằm ở đây
// import Footer from '...';

const ClientLayout = () => {
  return (
    <div className="relative min-h-screen">
      
      {/* 1. Navbar cố định */}
      <Navbar /> 

      {/* ⭐️ 2. KHỐI ĐỆM: Thêm padding-top để bù vào chiều cao của Navbar (80px) ⭐️ */}
      {/* Sử dụng class pt-20 (80px) để khớp với h-20 của Navbar */}
      <main className="pt-20"> 
        <Outlet />
      </main>

      {/* Footer nếu có */}
    </div>
  );
};
export default ClientLayout;