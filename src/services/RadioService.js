import httpAxios from "./httpAxios";
import httpAdmin from "./httpAdmin";

const RadioService = {
  // Client (User)
  getAllPublic: () => httpAxios.get("/radio"),

  // Admin (Lấy tất cả để không bị mất bài ẩn)
  getAllAdmin: () => httpAdmin.get("/radio/admin/all"), // Gọi endpoint mới sửa ở trên

  // Tạo mới (Dùng FormData để upload file)
  create: (formData) => {
    return httpAdmin.post("/radio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Cập nhật (Tương tự)
  update: (id, formData) => {
    return httpAdmin.put(`/radio/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id) => httpAdmin.delete(`/radio/${id}`),
  getById: (id) => httpAdmin.get(`/radio/${id}`),
};

export default RadioService;