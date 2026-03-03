import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GachaService from "../../../services/GachaService";
import { ArrowLeft, Loader2, Save, Image as ImageIcon, Gift, UploadCloud, X } from "lucide-react";

export default function GachaCreate() {
    const navigate = useNavigate();
    
    // State dữ liệu form (bỏ imageUrl vì sẽ sinh ra sau khi upload)
    const [formData, setFormData] = useState({
        name: "",
        type: "SKIN",
        rarity: "COMMON",
        dropWeight: 100
    });

    // State cho file ảnh
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // State trạng thái UI
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" }); 

    // Clean up preview URL khi component unmount để tránh leak memory
    useEffect(() => {
        return () => {
            if (previewImage) URL.revokeObjectURL(previewImage);
        };
    }, [previewImage]);

    // Handler thay đổi input text/number
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'dropWeight' ? parseInt(value) || 0 : value
        }));
    };

    // ✅ Handler: Chọn file ảnh từ máy
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate loại file
            if (!file.type.startsWith("image/")) {
                setMessage({ text: "Vui lòng chỉ chọn file ảnh!", type: "error" });
                return;
            }
            
            setSelectedFile(file);
            // Tạo preview ngay lập tức
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        }
    };

    // ✅ Handler: Xóa ảnh đã chọn
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewImage(null);
    };

    // ✅ Handler: Submit Form (Dùng FormData)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate cơ bản
        if (!formData.name.trim()) { 
            setMessage({ text: "Tên vật phẩm không được để trống!", type: "error" });
            return; 
        }

        setIsSubmitting(true);
        setMessage({ text: "Đang tải lên...", type: "loading" });

        try {
            // 1. Tạo đối tượng FormData
            const dataToSend = new FormData();
            
            // 2. Đóng gói thông tin JSON vào key "item"
            // Backend cần: @RequestPart("item") String itemJson
            dataToSend.append("item", JSON.stringify(formData));

            // 3. Đóng gói File vào key "file" (nếu có)
            if (selectedFile) {
                dataToSend.append("file", selectedFile);
            }

            // 4. Gọi Service (Service cần hỗ trợ multipart/form-data)
            await GachaService.create(dataToSend);

            setMessage({ text: "🎉 Tạo vật phẩm thành công!", type: "success" });
            setTimeout(() => navigate("/admin/gachas"), 1500);

        } catch (err) {
            console.error("Lỗi:", err);
            const errorMsg = err.response?.data || "Có lỗi xảy ra!";
            setMessage({ text: "❌ Thất bại: " + errorMsg, type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Gift className="text-blue-600" /> Tạo vật phẩm Gacha
                    </h1>
                    <p className="text-gray-500 mt-1">Thêm vật phẩm, trang phục hoặc tiền tệ vào kho quà.</p>
                </div>
                <button
                    onClick={() => navigate("/admin/gachas")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
            </div>

            {/* --- MESSAGE ALERT --- */}
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

            {/* --- MAIN FORM --- */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-100">
                        {/* Tên vật phẩm */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên vật phẩm <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="VD: Skin Thánh Gióng, Thẻ Đổi Tên..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" 
                                required 
                            />
                        </div>

                        {/* Loại & Độ hiếm */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Loại (Type)</label>
                                <select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white"
                                >
                                    <option value="SKIN">Trang phục (SKIN)</option>
                                    <option value="NAME_CARD">Thẻ tên (NAME_CARD)</option>
                                    <option value="ITEM">Vật phẩm (ITEM)</option>
                                    <option value="CURRENCY">Tiền tệ (CURRENCY)</option>
                                    <option value="PROTECTION">Thẻ bảo hộ (PROTECTION)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Độ hiếm</label>
                                <select 
                                    name="rarity" 
                                    value={formData.rarity} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white"
                                >
                                    <option value="COMMON">Phổ biến (COMMON)</option>
                                    <option value="RARE">Hiếm (RARE)</option>
                                    <option value="LEGENDARY">Huyền thoại (LEGENDARY)</option>
                                </select>
                            </div>
                        </div>

                        {/* Trọng số rơi */}
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-blue-800 mb-1">Trọng số rơi (Drop Weight)</label>
                                <p className="text-xs text-blue-600">
                                    Chỉ số càng cao, vật phẩm càng dễ quay trúng.
                                </p>
                            </div>
                            <input 
                                type="number" 
                                name="dropWeight" 
                                min="1"
                                value={formData.dropWeight} 
                                onChange={handleChange} 
                                className="w-24 border border-blue-300 rounded-lg p-2 text-center font-bold text-blue-800 focus:ring-2 focus:ring-blue-500 outline-none" 
                                required
                            />
                        </div>
                    </div>

                    {/* CỘT PHẢI: UPLOAD ẢNH & LƯU */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Box Upload Ảnh */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-blue-500"/> Hình ảnh
                            </h3>
                            
                            {/* Khu vực Upload / Preview */}
                            <div className="w-full h-56 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center overflow-hidden mb-4 relative hover:bg-gray-50 transition-colors">
                                
                                {previewImage ? (
                                    <>
                                        <img 
                                            src={previewImage} 
                                            alt="Preview" 
                                            className="w-full h-full object-contain p-2" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-transform hover:scale-110"
                                            title="Xóa ảnh"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                        <UploadCloud size={48} className="text-blue-300 mb-2" />
                                        <p className="text-sm text-gray-500 font-bold">Nhấn để tải ảnh lên</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 2MB)</p>
                                        {/* Input file ẩn */}
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={handleFileChange} 
                                        />
                                    </label>
                                )}
                            </div>

                            <p className="text-[11px] text-center text-gray-400 italic">
                                * Khuyên dùng ảnh PNG không nền (Transparent) để hiển thị đẹp nhất trong game.
                            </p>
                        </div>

                        {/* Nút Submit Lớn */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" /> Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Save size={24} /> LƯU VẬT PHẨM
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}