import httpAdmin from "./httpAdmin"; 

const TopicService = {
  // 1. Lấy tất cả chủ đề
  getAllForAdmin: () => {
    return httpAdmin.get('/questions/all-topics'); 
  },

  // 2. Lấy chi tiết
  getById: (id) => {
    return httpAdmin.get(`/questions/detail/${id}`);
  },

  // 3.1. Admin tạo chủ đề FULL (Có thể là logic cũ của bạn)
  createFullTopic: (formData) => {
    return httpAdmin.post('/questions/create-full-topic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 3.2. [MỚI] API Upload file PDF để tạo Topic (Fix lỗi 403)
  // Dùng httpAdmin để đảm bảo Token được gửi đi
  createTopicOnly: (formData) => {
    return httpAdmin.post('/questions/create-topic-only', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 3.3. [MỚI] API Tạo thủ công (Fix lỗi TypeError: .create is not a function)
  // Bạn cần kiểm tra lại endpoint backend cho việc tạo thủ công là gì nhé. 
  // Ở đây mình để tạm là POST /questions/create
  create: (data) => {
    return httpAdmin.post('/questions/create', data);
  },

  // 4. Cập nhật
  update: (id, formData) => {
    return httpAdmin.put(`/questions/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 5. Xóa
  remove: (id) => {
    return httpAdmin.delete(`/questions/${id}`); 
  },
  
  // 6. Duyệt/Ẩn
  updateStatus: (id, status) => {
      return httpAdmin.put(`/questions/${id}/status`, { status });
  },
};

export default TopicService;