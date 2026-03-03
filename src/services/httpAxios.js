// import axios from 'axios';

// const httpAxios = axios.create({
//   //baseURL: 'http://localhost:8080/api',
//   baseURL: 'http://172.20.10.2:8080/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Interceptor: CHỈ lấy token từ key 'client_token'
// httpAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('client_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Interceptor: Xử lý lỗi trả về
// httpAxios.interceptors.response.use(
//   (response) => response,
//   (error) => {
    
//     // Xử lý khi Token hết hạn (401) hoặc Không có quyền (403)
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       // Xóa sạch thông tin của Client
//       localStorage.removeItem('client_token');
//       localStorage.removeItem('client_user');
      
//       // Dispatch sự kiện để App.jsx hoặc Header biết mà cập nhật lại giao diện
//       window.dispatchEvent(new Event("clientLogout"));
//     }
//     return Promise.reject(error);
//   }
// );

// export default httpAxios;

import axios from 'axios';
import API_BASE_URL from './apiConfig';

const httpAxios = axios.create({
  // SAI: baseURL: 'http://172.20.10.2:5173/api', (5173 là Frontend)
  // ĐÚNG: Phải trỏ về Backend Java chạy ở port 8080
  baseURL: API_BASE_URL /* 'http://172.20.10.2:8080/api' */, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: CHỈ lấy token từ key 'client_token'
httpAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('client_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi trả về (Đã thêm phần Alert để debug trên điện thoại)
httpAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // -----------------------------------------------------
    // DEBUG: Hiển thị lỗi ra màn hình điện thoại
    // -----------------------------------------------------
    if (error.response) {
        // Kiểm tra xem Server có trả về HTML (Trang chủ/Lỗi trắng) thay vì JSON không
        const responseDataStr = JSON.stringify(error.response.data || "");
        
        if (responseDataStr.includes("<!DOCTYPE html>") || responseDataStr.includes("<html")) {
            alert(`⚠️ LỖI CẤU HÌNH: \nAPI đang trả về trang web HTML thay vì dữ liệu!\n\nNguyên nhân: Có thể sai đường dẫn API hoặc sai Port.\nURL gọi: ${error.config.url}`);
        } else {
            // Hiển thị lỗi từ Backend (ví dụ: "Tài khoản đã tồn tại")
            const serverMessage = error.response.data.message || JSON.stringify(error.response.data);
            alert(`❌ Lỗi Server (${error.response.status}):\n${serverMessage}`);
        }

        // Xử lý khi Token hết hạn (401) hoặc Không có quyền (403)
        if (error.response.status === 401 || error.response.status === 403) {
            localStorage.removeItem('client_token');
            localStorage.removeItem('client_user');
            window.dispatchEvent(new Event("clientLogout"));
        }
    } else if (error.request) {
        // Lỗi này nghĩa là KHÔNG chạm được tới Backend (Sai IP, Firewall chặn, hoặc chưa bật Backend)
        alert(`⚠️ Lỗi Kết Nối Mạng:\nKhông thể kết nối tới Server tại: ${error.config.baseURL}\n\nHãy kiểm tra:\n1. IP máy tính có đổi không?\n2. Firewall đã tắt chưa?\n3. Backend đã chạy chưa?`);
    } else {
        alert(`💀 Lỗi Code React: ${error.message}`);
    }
    // -----------------------------------------------------

    return Promise.reject(error);
  }
);

export default httpAxios;