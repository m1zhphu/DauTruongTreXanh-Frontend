// services/ClientTopicService.js
import httpAxios from "../services/httpAxios"; // <-- QUAN TRỌNG: Dùng axios của Client

const ClientTopicService = {
  // API tạo chủ đề cho người dùng (User thường)
  createFullTopic: (formData) => {
    return httpAxios.post('/questions/create-full-topic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  },

  // Lấy danh sách chủ đề (Cho trang Home)
  getAll: () => {
    return httpAxios.get('/game/topics'); 
  },
  
  // Tham gia phòng thi private
  joinPrivate: (accessCode, password) => {
    return httpAxios.post('/game/join', { accessCode, password });
  }
};

export default ClientTopicService;