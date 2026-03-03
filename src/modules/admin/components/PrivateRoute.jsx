import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  // 1. Xác định xem Route này có phải dành cho Admin không
  // Dựa vào việc allowedRoles có chứa "ROLE_ADMIN" hay không
  const isAdminRoute = allowedRoles && allowedRoles.includes('ROLE_ADMIN');

  // 2. Lấy token và user từ đúng "kho" (localStorage) tương ứng
  const token = isAdminRoute 
    ? localStorage.getItem('admin_token') 
    : localStorage.getItem('client_token');

  const userString = isAdminRoute
    ? localStorage.getItem('admin_user')
    : localStorage.getItem('client_user');

  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch {
      user = null;
    }
  }

  // 3. CHECK 1: Chưa đăng nhập -> Đá về trang Login tương ứng
  if (!token || !user) {
    // Nếu đang định vào trang Admin mà chưa login -> Về /admin/login
    if (isAdminRoute) {
        return <Navigate to="/admin/login" replace />;
    }
    // Nếu trang thường -> Về /login
    return <Navigate to="/login" replace />;
  }

  // 4. CHECK 2: Sai quyền (Role)
  // Ví dụ: User thường cố tình truy cập link admin
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Nếu đang ở route Admin -> Đá ra login admin
    if (isAdminRoute) return <Navigate to="/admin/login" replace />;
    // Nếu route thường -> Về trang chủ
    return <Navigate to="/" replace />;
  }

  // 5. Hợp lệ -> Cho phép truy cập
  return <Outlet />;
};

export default PrivateRoute;