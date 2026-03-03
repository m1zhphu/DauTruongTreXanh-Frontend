import React, { useState, useEffect } from 'react'; // <-- Thêm useEffect
import { useNavigate } from 'react-router-dom';     // <-- Import useNavigate
import TopicService from '../../../services/ClientTopicService';
// Giữ nguyên các import icon của bạn
import { UploadCloud, Clock, Lock, Globe, FileText, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const AddTopic = () => {
  const navigate = useNavigate(); // Hook chuyển trang

  // 1. KIỂM TRA ĐĂNG NHẬP (LOGIC MỚI)
  useEffect(() => {
    const token = localStorage.getItem('client_token');
    const user = localStorage.getItem('client_user');

    if (!token || !user) {
      // Nếu không có token hoặc user -> Chuyển hướng về trang Login
      alert("⚠️ Bạn cần đăng nhập để tạo chủ đề!");
      navigate('/login');
    }
  }, [navigate]);

  // 2. STATE (Giữ nguyên)
  const [formData, setFormData] = useState({
    title: '',
    numQuestions: 10,
    isPublic: true,
    accessCode: '',
    password: '',
    startNow: true, 
    startTime: '',  
    endTime: ''     
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ... (Giữ nguyên phần HELPERS và HANDLERS cũ của bạn) ...
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const togglePublic = () => {
    setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };

  // 3. SUBMIT (Cập nhật nhỏ để an toàn hơn)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Kiểm tra lại token lần nữa trước khi gửi (đề phòng token hết hạn lúc đang điền form)
    const token = localStorage.getItem('client_token');
    if (!token) {
        navigate('/login');
        return;
    }

    // Validate (Giữ nguyên)
    if (!file) {
      setMessage({ type: 'error', text: '⚠️ Vui lòng tải lên file PDF giáo án!' });
      return;
    }

    let finalStartTime = formData.startTime;
    if (formData.startNow) {
        finalStartTime = getCurrentDateTimeLocal();
    } else if (!finalStartTime) {
        setMessage({ type: 'error', text: '⚠️ Vui lòng chọn thời gian mở bài!' });
        return;
    }

    if (formData.endTime && finalStartTime > formData.endTime) {
        setMessage({ type: 'error', text: '⚠️ Thời gian kết thúc phải sau thời gian bắt đầu!' });
        return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('title', formData.title);
      data.append('numQuestions', formData.numQuestions);
      data.append('isPublic', formData.isPublic);
      data.append('startTime', finalStartTime);
      if (formData.endTime) data.append('endTime', formData.endTime);

      if (!formData.isPublic) {
        data.append('accessCode', formData.accessCode);
        data.append('password', formData.password);
      }

      // Backend có thể cần biết ID người tạo, nhưng thường backend sẽ tự lấy từ Token (Bearer Auth).
      // Nếu backend của bạn cần userId trong FormData, hãy bỏ comment dòng dưới:
      // const userObj = JSON.parse(localStorage.getItem('client_user'));
      // data.append('userId', userObj.id); 

      const res = await TopicService.createFullTopic(data);

      setMessage({ 
        type: 'success', 
        text: `🎉 Thành công! Đã tạo chủ đề "${res.data.topicName}" (${res.data.questionCount} câu)` 
      });
      
    } catch (error) {
      console.error(error);
      // Xử lý lỗi 401 (Unauthorized) nếu backend trả về
      if (error.response && error.response.status === 401) {
          setMessage({ type: 'error', text: '❌ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' });
          setTimeout(() => navigate('/login'), 2000);
      } else {
          const errorMsg = error.response?.data?.message || error.response?.data || "Lỗi máy chủ.";
          setMessage({ type: 'error', text: `❌ Lỗi: ${errorMsg}` });
      }
    } finally {
      setLoading(false);
    }
  };

  // ... (Phần return JSX GIỮ NGUYÊN HOÀN TOÀN như code cũ của bạn) ...
  return (
    <div className="page-wrapper">
      <div className="modern-card">
        {/* HEADER */}
        <div className="card-header">
          <h2>Tạo Chủ Đề Của Riêng Bạn</h2>
          <p>Tải lên tài liệu và thiết lập bài kiểm tra thông minh</p>
        </div>

        {/* THÔNG BÁO */}
        {message && (
          <div className={`message-box ${message.type === 'success' ? 'msg-success' : 'msg-error'}`}>
            {message.type === 'success' ? <CheckCircle size={20} style={{display:'inline', marginRight:5}}/> : <AlertCircle size={20} style={{display:'inline', marginRight:5}}/>}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
          <div className="form-section-title">
            <FileText size={18} /> Thông tin chung
          </div>
          
          <div className="form-grid">
            <div className="modern-group">
              <label>Tên bài học</label>
              <input 
                type="text" name="title" className="modern-input" 
                placeholder="VD: Kiểm tra 15 phút Toán 12"
                value={formData.title} onChange={handleChange} required 
              />
            </div>
            <div className="modern-group">
              <label>Số lượng câu hỏi</label>
              <input 
                type="number" name="numQuestions" className="modern-input" 
                min="1" max="100" 
                value={formData.numQuestions} onChange={handleChange} required 
              />
            </div>
          </div>

          <div className="modern-group">
            <label>Tài liệu nguồn (PDF)</label>
            <div className={`file-drop-area ${file ? 'has-file' : ''}`}>
              <div className="file-icon-wrapper">
                {file ? <CheckCircle color="#10b981" /> : <UploadCloud color="#3b82f6" />}
              </div>
              <span className="file-msg">
                {file ? <b>{file.name}</b> : "Nhấn để tải lên file PDF giáo án"}
              </span>
              <input 
                type="file" className="file-input" accept="application/pdf" 
                onChange={handleFileChange} 
              />
            </div>
          </div>

          {/* PHẦN 2: THỜI GIAN */}
          <div className="form-section-title">
            <Clock size={18} /> Thời gian làm bài
          </div>

          <div className="time-settings-card">
            <div className="checkbox-wrapper" onClick={() => setFormData({...formData, startNow: !formData.startNow})}>
              <input 
                type="checkbox" className="custom-checkbox"
                name="startNow" checked={formData.startNow} onChange={handleChange}
              />
              <span className="checkbox-label">Mở bài thi ngay sau khi tạo</span>
            </div>

            <div className="form-grid">
                <div style={{opacity: formData.startNow ? 0.5 : 1, transition: '0.3s'}}>
                    <label>Thời gian mở</label>
                    <input 
                        type="datetime-local" name="startTime" className="modern-input"
                        value={formData.startTime} onChange={handleChange}
                        disabled={formData.startNow}
                    />
                </div>
                <div>
                    <label>Thời gian đóng (Tùy chọn)</label>
                    <input 
                        type="datetime-local" name="endTime" className="modern-input"
                        value={formData.endTime} onChange={handleChange}
                    />
                </div>
            </div>
          </div>

          {/* PHẦN 3: BẢO MẬT */}
          <div className="form-section-title">
            <Lock size={18} /> Quyền truy cập
          </div>

          <div className="modern-group">
            <div 
              className={`toggle-container ${formData.isPublic ? 'active' : 'inactive'}`} 
              onClick={togglePublic}
            >
              <div className="toggle-info">
                {formData.isPublic ? <Globe size={20} /> : <Lock size={20} />}
                {formData.isPublic ? "Công khai (Public)" : "Riêng tư (Private)"}
              </div>
              <div className="toggle-switch"></div>
            </div>
          </div>

          {!formData.isPublic && (
            <div className="private-fields">
              <div className="form-grid">
                <div className="modern-group" style={{marginBottom:0}}>
                  <label>Mã lớp (Room ID)</label>
                  <input 
                    type="text" name="accessCode" className="modern-input" 
                    placeholder="VD: LOP12A"
                    value={formData.accessCode} onChange={handleChange} 
                  />
                </div>
                <div className="modern-group" style={{marginBottom:0}}>
                  <label>Mật khẩu</label>
                  <input 
                    type="text" name="password" className="modern-input" 
                    placeholder="******"
                    value={formData.password} onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? 'Hệ thống đang xử lý...' : 'Tạo Bài Tập Ngay'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddTopic;