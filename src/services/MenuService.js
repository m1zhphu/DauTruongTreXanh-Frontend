// ✅ Import file cấu hình chung (Kiểm tra lại đường dẫn ../ cho đúng thư mục)
import httpAdmin from "../config/httpAdmin"; 

class MenuService {
    getAll() {
        // ✅ Chỉ cần gọi đuôi "/menus", phần đầu "/api" đã có trong cấu hình chung
        return httpAdmin.get("/menus");
    }

    // --- Gợi ý các hàm CRUD khác nếu bạn cần sau này ---
    /*
    create(data) {
        return httpAdmin.post("/menus", data);
    }

    update(id, data) {
        return httpAdmin.put(`/menus/${id}`, data);
    }

    delete(id) {
        return httpAdmin.delete(`/menus/${id}`);
    }
    */
}

export default new MenuService();