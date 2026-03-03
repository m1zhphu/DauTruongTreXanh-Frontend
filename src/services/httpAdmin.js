import axios from 'axios';
import API_BASE_URL from './apiConfig';

// Tạo instance riêng cho Admin
const httpAdmin = axios.create({
  baseURL: API_BASE_URL /* 'http://localhost:8080/api' */, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Tự động gắn token Admin vào header
httpAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Xử lý khi Token hết hạn hoặc không có quyền
httpAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Xóa sạch thông tin Admin
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      // Bắn event để các component khác biết (nếu cần)
      window.dispatchEvent(new Event("adminLogout"));
      
      // Redirect cứng về trang login (tuỳ chọn, nhưng an toàn hơn navigate trong file js thường)
      // window.location.href = '/admin/login'; 
    }
    return Promise.reject(error);
  }
);

export default httpAdmin;