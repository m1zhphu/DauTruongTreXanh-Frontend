import httpAdmin from "./httpAdmin";

const GachaService = {
  getAll: () => httpAdmin.get("/admin/gacha/items"),
  
  create: (formData) => {
    return httpAdmin.post("/admin/gacha/items", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ✅ Đảm bảo dùng PUT
  update: (id, formData) => {
    return httpAdmin.put(`/admin/gacha/items/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ✅ Đảm bảo dùng DELETE
  delete: (id) => httpAdmin.delete(`/admin/gacha/items/${id}`),
};

export default GachaService;