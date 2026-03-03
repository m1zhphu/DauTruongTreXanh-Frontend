import API_BASE_URL from '../services/apiConfig';

export const getFullAudioUrl = (url) => {
    if (!url) return "";
    
    // 1. Nếu là Link Online (Youtube, Soundcloud...)
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // 2. Xử lý logic nối Host (Bỏ /api ở cuối nếu có)
    const serverHost = API_BASE_URL.endsWith('/api') 
        ? API_BASE_URL.slice(0, -4) 
        : API_BASE_URL;

    // 3. Đảm bảo url bắt đầu bằng dấu "/"
    const safeUrl = url.startsWith("/") ? url : `/${url}`;

    // 4. Nếu đường dẫn cũ (/uploads/...) -> đổi thành API mới (/api/upload/files/...)
    if (safeUrl.startsWith("/uploads/")) {
        return `${serverHost}/api/upload/files${safeUrl.replace('/uploads', '')}`;
    }

    // 5. Trả về URL hoàn chỉnh
    return `${serverHost}${safeUrl}`;
};