import React, { useState, useEffect } from 'react';
import UserService from '../../../services/UserService';
import { Search, Filter, ChevronDown, Trash2, Edit, RefreshCw, XCircle, Users, Mail, Shield, Coins, Trophy } from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  
  const [keyword, setKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // Thay Topic bằng Role
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole]); 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách User
      const roleParam = selectedRole || null;
      const res = await UserService.getAllForAdmin(page, 10, keyword, roleParam);
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Lỗi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers(); 
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedRole('');
    setPage(0);
    fetchUsersManual('', null, 0); 
  };

  const fetchUsersManual = async (key, role, pg) => {
    setLoading(true);
    try {
      const res = await UserService.getAllForAdmin(pg, 10, key, role);
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Helper để hiển thị Role đẹp hơn
  const getRoleBadge = (role) => {
    if (role === 'ROLE_ADMIN') {
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">Quản Trị Viên</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Học Viên</span>;
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8 flex flex-col font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Users size={36} className="text-blue-600" />
            Quản Lý Người Dùng
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Danh sách và thông tin tài khoản thành viên.</p>
        </div>
        <div className="text-base text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          Tổng số trang: <span className="font-bold text-blue-700 text-lg ml-1">{totalPages}</span>
        </div>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col xl:flex-row gap-5 items-center justify-between">
        
        <form onSubmit={handleSearch} className="flex flex-1 gap-5 w-full">
          {/* Ô Tìm kiếm */}
          <div className="relative flex-1">
            <Search className="absolute left-5 top-4 text-gray-400" size={22} />
            <input 
              type="text" 
              className="w-full pl-14 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-gray-700 text-base"
              placeholder="Tìm theo Tên, Username hoặc Email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword && (
              <button 
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            )}
          </div>

          {/* Dropdown Role */}
          <div className="relative w-1/3 min-w-[250px]">
            <Shield className="absolute left-5 top-4 text-gray-400" size={22} />
            <select 
              className="w-full pl-14 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-gray-700 text-base"
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setPage(0); }}
            >
              <option value="">-- Tất cả vai trò --</option>
              <option value="ROLE_USER">Học Viên (User)</option>
              <option value="ROLE_ADMIN">Quản Trị Viên (Admin)</option>
            </select>
            <ChevronDown className="absolute right-5 top-4 text-gray-400 pointer-events-none" size={20} />
          </div>

          {/* Nút Tìm kiếm */}
          <button type="submit" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 text-base">
            <Search size={22} />
            Tìm
          </button>
        </form>

        {/* Nút Reset */}
        <button 
          onClick={handleReset} 
          className="px-6 py-3.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2 text-base shadow-sm"
        >
          <RefreshCw size={22} />
          <span className="hidden xl:inline">Làm mới</span>
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100/80 text-gray-500 uppercase text-sm font-bold tracking-wider border-b border-gray-200">
            <tr>
              <th className="p-6 w-20 text-center">ID</th>
              <th className="p-6">Thông tin cá nhân</th>
              <th className="p-6">Liên hệ</th>
              <th className="p-6 text-center">Vai trò</th>
              <th className="p-6 text-center">Tài sản</th>
              <th className="p-6 w-20 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="6" className="p-16 text-center text-gray-500 italic text-lg">Đang tải dữ liệu...</td></tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-20 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-4">
                    <Users size={64} className="opacity-20" />
                    <span className="text-xl font-medium">Không tìm thấy người dùng nào.</span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <React.Fragment key={u.id}>
                  {/* MAIN ROW */}
                  <tr 
                    className={`transition-colors cursor-pointer border-l-4 ${expandedRow === u.id ? 'bg-blue-50/60 border-blue-600' : 'bg-white border-transparent hover:bg-gray-50'}`} 
                    onClick={() => toggleExpand(u.id)}
                  >
                    <td className="p-6 text-center font-mono text-gray-400">#{u.id}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                            {/* Chỗ này cần nối đường dẫn ảnh nếu cần, ví dụ: src={`http://localhost:8080/images/${u.avatarUrl}`} */}
                            <img src={u.avatarUrl || "https://via.placeholder.com/150"} alt="avt" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                            <div className="font-bold text-gray-800 text-lg">{u.name}</div>
                            <div className="text-sm text-gray-500 font-mono">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={16} /> {u.email}
                        </div>
                    </td>
                    <td className="p-6 text-center">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-sm font-bold text-yellow-600 flex items-center gap-1"><Trophy size={14}/> {u.totalXp || 0} XP</span>
                            <span className="text-sm font-bold text-green-600 flex items-center gap-1"><Coins size={14}/> {u.rice || 0} Gạo</span>
                        </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className={`p-2.5 rounded-full inline-flex transition-transform duration-300 ${expandedRow === u.id ? 'bg-blue-100 text-blue-700 rotate-180' : 'text-gray-400 hover:bg-gray-200'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED ROW DETAILS */}
                  {expandedRow === u.id && (
                    <tr className="bg-blue-50/40 animate-fade-in">
                      <td colSpan="6" className="p-8 border-b border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          {/* Cột trái: Thông tin chi tiết */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Chi tiết hoạt động</h4>
                            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Chuỗi ngày học (Streak)</p>
                                    <p className="text-xl font-bold text-orange-500">🔥 {u.currentStreak || 0} ngày</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Đăng nhập qua</p>
                                    <p className="text-xl font-bold text-gray-700">{u.authProvider || "LOCAL"}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Ngày học gần nhất</p>
                                    <p className="text-base font-medium text-gray-800">{u.lastStudyDate ? new Date(u.lastStudyDate).toLocaleString() : "Chưa học bài nào"}</p>
                                </div>
                            </div>
                          </div>

                          {/* Cột phải: Hành động */}
                          <div className="flex flex-col justify-between">
                             <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Quản trị</h4>
                                <div className="text-gray-600 text-sm">
                                    ID Database: <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">{u.id}</span>
                                </div>
                             </div>
                            
                            <div className="mt-4 flex gap-4 justify-end">
                                <button className="flex items-center gap-2 text-gray-700 bg-white border border-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-50 font-bold transition shadow-sm">
                                    <Edit size={18} /> Sửa thông tin
                                </button>
                                <button className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-5 py-2.5 rounded-xl hover:bg-red-100 font-bold transition shadow-sm">
                                    <Trash2 size={18} /> Xóa tài khoản
                                </button>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION --- */}
      <div className="flex justify-between items-center mt-8">
        <span className="text-gray-600 text-base font-medium bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm">
          Trang <span className="font-bold text-gray-900">{page + 1}</span> / {totalPages > 0 ? totalPages : 1}
        </span>
        <div className="flex gap-3">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95 text-base"
          >
            ← Trước
          </button>
          <button 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95 text-base"
          >
            Sau →
          </button>
        </div>
      </div>

    </div>
  );
};

export default UserManager;