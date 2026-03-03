import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Facebook, Youtube, Instagram, MapPin, Mail, Phone } from "lucide-react";

// ⭐ IMPORT NAVBAR
import Navbar from "../components/Navbar";

const PublicLayout = () => {
  const location = useLocation();

  // ⭐ Tự động cuộn lên đầu trang khi đổi route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">

      {/* ================= HEADER ================= */}
      <Navbar />

      {/* ⭐ Đẩy nội dung xuống dưới Header cố định */}
      <div className="pt-20 flex-grow">
        {/* ================= MAIN CONTENT ================= */}
        <main className="w-full">
          <Outlet />
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* --- COL 1: Info --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold">T</div>
                <span className="text-xl font-bold text-gray-800">MinhPhuEdu</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Nền tảng học tập thông minh kết hợp Gamification. Giúp bạn chinh phục kiến thức như Thánh Gióng nhổ tre.
              </p>

              <div className="flex gap-4 pt-2">
                <a href="#" className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 transition">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-600 transition">
                  <Youtube size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-500 hover:text-pink-600 hover:border-pink-600 transition">
                  <Instagram size={16} />
                </a>
              </div>
            </div>

            {/* --- COL 2: Links --- */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Khám phá</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-green-600 transition">Trang chủ</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Tính năng</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Bảng xếp hạng</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Blog học tập</a></li>
              </ul>
            </div>

            {/* --- COL 3: Support --- */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Hỗ trợ</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-green-600 transition">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Liên hệ báo lỗi</a></li>
              </ul>
            </div>

            {/* --- COL 4: Contact --- */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Liên hệ</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-green-600 mt-0.5" />
                  <span>Tòa nhà Innovation, Công viên phần mềm Quang Trung, TP.HCM</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-green-600" />
                  <span>support@MinhPhu.edu.vn</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-green-600" />
                  <span>1900 1000 (8:00 - 17:00)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* --- COPYRIGHT --- */}
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MinhPhuEdu. All rights reserved. Designed with ❤️.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
