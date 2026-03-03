import httpAdmin from "./httpAdmin";

const QuestionService = {
  // Gọi API phân trang
  getAll: (page, size, keyword, topicId) => {
    return httpAdmin.get('/questions/admin-list', {
      params: { page, size, keyword, topicId }
    });
  },
  
  // Xóa câu hỏi (nếu cần)
  delete: (id) => {
    return httpAdmin.delete(`/questions/${id}`);
  }
};

export default QuestionService;