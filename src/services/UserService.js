import httpAdmin from "./httpAdmin";

const UserService = {
  // 1. Lấy danh sách user (có phân trang, tìm kiếm, lọc role)
  getAllForAdmin: (page, size, keyword, role) => {
    return httpAdmin.get('/admin/users', {
      params: {
        page,
        size,
        keyword,
        role
      }
    });
  },

  // 2. Xóa user theo ID
  delete: (id) => {
    return httpAdmin.delete(`/admin/users/${id}`);
  },

  // 3. Lấy chi tiết user (Nếu sau này cần dùng để sửa)
  getById: (id) => {
    return httpAdmin.get(`/admin/users/${id}`);
  },

  // 4. Cập nhật thông tin user (Nếu sau này cần chức năng sửa)
  update: (id, data) => {
    return httpAdmin.put(`/admin/users/${id}`, data);
  }
};

export default UserService;