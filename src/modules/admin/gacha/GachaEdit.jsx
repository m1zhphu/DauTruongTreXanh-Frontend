import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GachaService from "../../../services/GachaService";
import API_BASE_URL from "../../../services/apiConfig"; // Import để xử lý link ảnh
import { Save, ArrowLeft, Image as ImageIcon, Loader2, UploadCloud, X, Edit } from "lucide-react";

const GachaEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Dữ liệu Text
  const [formData, setFormData] = useState({
    name: "",
    type: "SKIN",
    rarity: "COMMON",
    dropWeight: 100
    // Không cần lưu imageUrl vào đây để gửi đi, vì imageUrl chỉ để hiển thị
  });

  // Dữ liệu Ảnh
  const [serverImageUrl, setServerImageUrl] = useState(""); // Link ảnh gốc từ server
  const [selectedFile, setSelectedFile] = useState(null);   // File mới chọn (nếu có)
  const [previewNewImage, setPreviewNewImage] = useState(null); // Preview ảnh mới

  // --- EFFECT: Lấy dữ liệu chi tiết ---
  useEffect(() => {
    fetchDetail();
    
    // Cleanup preview URL để tránh memory leak
    return () => {
      if (previewNewImage) URL.revokeObjectURL(previewNewImage);
    };
  }, [id]);

  const fetchDetail = async () => {
    try {
      // Backend chưa có getById, dùng tạm getAll -> find
      const res = await GachaService.getAll();
      const item = res.data.find((i) => i.id === parseInt(id));

      if (item) {
        setFormData({
          name: item.name,
          type: item.type,
          rarity: item.rarity,
          dropWeight: item.dropWeight,
        });
        setServerImageUrl(item.imageUrl); // Lưu link ảnh cũ
      } else {
        setMessage({ text: "Không tìm thấy vật phẩm!", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Lỗi tải dữ liệu!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dropWeight" ? parseInt(value) || 0 : value,
    }));
  };

  // Xử lý chọn file mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ text: "Vui lòng chọn file ảnh!", type: "error" });
        return;
      }
      setSelectedFile(file);
      setPreviewNewImage(URL.createObjectURL(file)); // Tạo preview cho file mới
    }
  };

  // Xử lý hủy file mới chọn (quay về ảnh cũ)
  const handleCancelNewImage = () => {
    setSelectedFile(null);
    if (previewNewImage) URL.revokeObjectURL(previewNewImage);
    setPreviewNewImage(null);
  };

  // Hàm hiển thị ảnh (Ưu tiên ảnh mới -> Ảnh server -> Placeholder)
  const getDisplayImageSrc = () => {
    if (previewNewImage) return previewNewImage;
    if (serverImageUrl) {
        // Xử lý link ảnh từ server (nếu là đường dẫn tương đối)
        if (serverImageUrl.startsWith("http")) return serverImageUrl;
        // Bỏ đuôi /api nếu API_BASE_URL có sẵn, để ghép link ảnh tĩnh
        const baseUrlClean = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
        return `${baseUrlClean}${serverImageUrl}`;
    }
    return null;
  };

  // Submit Form (Dùng FormData để Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "Đang lưu thay đổi...", type: "loading" });

    try {
      const dataToSend = new FormData();
      
      // 1. Gửi JSON data (giống Create)
      dataToSend.append("item", JSON.stringify(formData));

      // 2. Gửi File (CHỈ KHI có chọn file mới)
      if (selectedFile) {
        dataToSend.append("file", selectedFile);
      }

      // 3. Gọi API Update
      await GachaService.update(id, dataToSend);

      setMessage({ text: "Cập nhật thành công!", type: "success" });
      setTimeout(() => navigate("/admin/gachas"), 1500);

    } catch (error) {
      console.error(error);
      const msg = error.response?.data || "Lỗi khi cập nhật!";
      setMessage({ text: "Thất bại: " + msg, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500"><Loader2 className="animate-spin mr-2"/> Đang tải dữ liệu...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Edit className="text-blue-600" /> Chỉnh sửa vật phẩm
            </h1>
            <p className="text-gray-500 mt-1">Cập nhật thông tin hoặc thay đổi hình ảnh cho ID: <span className="font-mono font-bold text-gray-700">#{id}</span></p>
          </div>
          <button onClick={() => navigate("/admin/gachas")} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg transition shadow-sm">
            <ArrowLeft size={20} /> Quay lại
          </button>
        </div>

        {/* ALERT MESSAGE */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 font-medium border ${
            message.type === 'success' ? "bg-green-50 text-green-800 border-green-200" 
            : message.type === 'error' ? "bg-red-50 text-red-800 border-red-200"
            : "bg-blue-50 text-blue-800 border-blue-200"
          }`}>
            {message.type === 'loading' && <Loader2 size={20} className="animate-spin" />}
            {message.text}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CỘT TRÁI: THÔNG TIN TEXT */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên vật phẩm <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Loại (Type)</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="SKIN">Trang phục (SKIN)</option>
                    <option value="NAME_CARD">Thẻ tên (NAME_CARD)</option>
                    <option value="ITEM">Vật phẩm (ITEM)</option>
                    <option value="CURRENCY">Tiền tệ (CURRENCY)</option>
                    <option value="PROTECTION">Thẻ bảo hộ (PROTECTION)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Độ hiếm</label>
                  <select name="rarity" value={formData.rarity} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="COMMON">Phổ biến (COMMON)</option>
                    <option value="RARE">Hiếm (RARE)</option>
                    <option value="LEGENDARY">Huyền thoại (LEGENDARY)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-blue-800 mb-1">Trọng số rơi (Drop Weight)</label>
                  <p className="text-xs text-blue-600">Thay đổi tỷ lệ xuất hiện khi quay.</p>
                </div>
                <input 
                  type="number" name="dropWeight" min="1" required
                  value={formData.dropWeight} onChange={handleChange}
                  className="w-24 border border-blue-300 rounded-lg p-2 text-center font-bold text-blue-800 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            {/* CỘT PHẢI: ẢNH ĐẠI DIỆN */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-blue-500"/> Hình ảnh
                </h3>
                
                {/* Khu vực Preview Ảnh */}
                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center overflow-hidden mb-4 relative group">
                  {getDisplayImageSrc() ? (
                    <>
                      <img src={getDisplayImageSrc()} alt="Preview" className="w-full h-full object-contain p-2" />
                      
                      {/* Nút Xóa ảnh mới chọn (chỉ hiện khi đang chọn ảnh mới) */}
                      {previewNewImage && (
                         <button type="button" onClick={handleCancelNewImage} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow hover:bg-red-600 transition" title="Hủy ảnh mới, dùng lại ảnh cũ">
                           <X size={16} />
                         </button>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                       <ImageIcon size={48} className="mb-2 opacity-50"/>
                       <span className="text-sm">Chưa có ảnh</span>
                    </div>
                  )}

                  {/* Overlay khi hover để đổi ảnh */}
                  <label className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition cursor-pointer flex items-center justify-center">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <div className="bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0 font-medium text-sm flex items-center gap-2">
                      <UploadCloud size={16}/> {getDisplayImageSrc() ? "Đổi ảnh khác" : "Tải ảnh lên"}
                    </div>
                  </label>
                </div>

                <p className="text-xs text-center text-gray-500 mb-4">
                  {previewNewImage ? "⚠️ Bạn đang chọn ảnh mới. Nhấn Lưu để cập nhật." : "Đang hiển thị ảnh hiện tại."}
                </p>

                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition disabled:opacity-70 flex items-center justify-center gap-2">
                  {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Đang lưu...</> : <><Save size={20} /> LƯU THAY ĐỔI</>}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default GachaEdit;