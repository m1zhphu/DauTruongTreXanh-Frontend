import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GachaService from "../../../services/GachaService";
import API_BASE_URL from "../../../services/apiConfig"; 
import { Plus, Edit, Trash2, Search, Gift, Loader, Image as ImageIcon } from "lucide-react";

const GachaList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await GachaService.getAll();
      setItems(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        await GachaService.delete(id);
        fetchItems(); // Load lại sau khi xóa
      } catch {
        alert("Xóa thất bại!");
      }
    }
  };

  // Hàm xử lý link ảnh
  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrlClean = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    return `${baseUrlClean}${url}`;
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Gift className="text-purple-600" size={32} /> Quản lý Gacha
          </h1>
          <p className="text-gray-500 mt-1">Danh sách tất cả vật phẩm trong game.</p>
        </div>
        <button onClick={() => navigate("/admin/gachas/new")} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">
          <Plus size={20} /> Thêm Mới
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 relative">
        <Search className="absolute left-8 top-7 text-gray-400" size={20} />
        <input type="text" placeholder="Tìm kiếm vật phẩm..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-5 text-center w-16">ID</th>
              <th className="p-5 w-24">Ảnh</th>
              <th className="p-5">Tên</th>
              <th className="p-5">Loại</th>
              <th className="p-5 text-center">Độ hiếm</th>
              <th className="p-5 text-center">Tỷ lệ</th>
              <th className="p-5 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="7" className="p-10 text-center"><Loader className="animate-spin inline"/> Đang tải...</td></tr>
            ) : filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                <td className="p-5 text-center font-mono text-gray-400">#{item.id}</td>
                <td className="p-5">
                  <div className="w-14 h-14 rounded-lg border bg-gray-50 p-1 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={getFullImageUrl(item.imageUrl)} className="w-full h-full object-contain" 
                        onError={(e) => {e.target.onerror=null; e.target.src="https://via.placeholder.com/150"}}/>
                    ) : <ImageIcon size={20} className="text-gray-300"/>}
                  </div>
                </td>
                <td className="p-5 font-bold text-gray-800">{item.name}</td>
                <td className="p-5"><span className="bg-gray-100 px-3 py-1 rounded text-xs font-bold">{item.type}</span></td>
                <td className="p-5 text-center"><span className="border px-3 py-1 rounded-full text-xs font-bold">{item.rarity}</span></td>
                <td className="p-5 text-center font-mono font-bold text-gray-600">{item.dropWeight}</td>
                <td className="p-5 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => navigate(`/admin/gachas/edit/${item.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GachaList;