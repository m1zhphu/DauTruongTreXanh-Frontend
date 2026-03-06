import axios from 'axios';
import API_BASE_URL from './apiConfig';

const httpAxios = axios.create({
  // Trỏ về Backend Java
  baseURL: API_BASE_URL, 
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

// Interceptor: Xử lý lỗi trả về (Đã gỡ bỏ toàn bộ alert)
httpAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response) {
        // Xử lý khi Token hết hạn (401) hoặc Không có quyền (403)
        if (error.response.status === 401 || error.response.status === 403) {
            localStorage.removeItem('client_token');
            localStorage.removeItem('client_user');
            
            // Dispatch sự kiện để App.jsx hoặc Header biết mà cập nhật lại giao diện
            window.dispatchEvent(new Event("clientLogout"));
        }
    } 

    return Promise.reject(error);
  }
);

export default httpAxios;