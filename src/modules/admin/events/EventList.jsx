import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Plus,
  Play,
  Trash2,
  ChevronDown,
  ChevronUp,
  Trophy,
  User,
  Medal,
  Crown,
  RefreshCw,
  Edit,
} from "lucide-react";

import httpAdmin from '../../../services/httpAdmin';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý việc mở rộng hàng
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [participantsMap, setParticipantsMap] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await httpAdmin.get("/events/all");
      setEvents(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách sự kiện:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchParticipants = async (eventId, force = false) => {
    if (!force && participantsMap[eventId]) return;

    setLoadingDetails(true);
    try {
      const res = await httpAdmin.get(`/events/${eventId}/participants`);
      setParticipantsMap((prev) => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error("Lỗi tải người tham gia:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleExpand = (eventId) => {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
    } else {
      setExpandedEventId(eventId);
      fetchParticipants(eventId);
    }
  };

  const handleRefreshParticipants = (e, eventId) => {
    e.stopPropagation();
    fetchParticipants(eventId, true);
  };

  const handleStartEvent = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn BẮT ĐẦU sự kiện này?")) return;

    try {
      await httpAdmin.post(`/events/${id}/start`);
      alert("✅ Sự kiện đã bắt đầu!");
      fetchEvents();
    } catch (err) {
      alert(
        "Lỗi: " + (err.response?.data?.message || "Không thể bắt đầu sự kiện")
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "UPCOMING":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            Sắp diễn ra
          </span>
        );
      case "LIVE":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200 flex items-center gap-1 w-fit">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{" "}
            Đang diễn ra
          </span>
        );
      case "ENDED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            Đã kết thúc
          </span>
        );
      default:
        return status;
    }
  };

  const getWinners = (eventId, eventStatus) => {
    const participants = participantsMap[eventId] || [];
    if (participants.length === 0) return [];

    const explicitWinners = participants.filter((p) => p.status === "WINNER");
    if (explicitWinners.length > 0) return explicitWinners;

    if (eventStatus === "ENDED") {
      const maxScore = Math.max(...participants.map((p) => p.score));
      return participants.filter((p) => p.score === maxScore);
    }

    return [];
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Sự Kiện</h1>
          <p className="text-gray-500 mt-1">
            Theo dõi người chiến thắng và kết quả thi đấu.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/events/create")}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1"
        >
          <Plus size={20} /> Tạo Sự kiện
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : events.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            Chưa có sự kiện nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-5 w-10"></th>
                  <th className="p-5 font-bold">Tên sự kiện</th>
                  <th className="p-5 font-bold">Chủ đề</th>
                  <th className="p-5 font-bold">Thời gian</th>
                  <th className="p-5 font-bold">Trạng thái</th>
                  <th className="p-5 font-bold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => {
                  const winners = getWinners(event.id, event.status);

                  return (
                    <React.Fragment key={event.id}>
                      <tr
                        className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                          expandedEventId === event.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => toggleExpand(event.id)}
                      >
                        <td className="p-5 text-gray-400">
                          {expandedEventId === event.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-gray-800 text-lg">
                            {event.title}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: #{event.id}
                          </div>
                        </td>
                        <td className="p-5 text-gray-700 font-medium">
                          {event.topic ? (
                            event.topic.name
                          ) : (
                            <span className="text-red-400 italic">Đã xóa</span>
                          )}
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col text-sm">
                            <span className="flex items-center gap-2 text-gray-700">
                              <Calendar
                                size={14}
                                className="text-emerald-500"
                              />
                              {new Date(event.startTime).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                            <span className="flex items-center gap-2 text-gray-500 mt-1">
                              <Clock size={14} className="text-emerald-500" />
                              {new Date(event.startTime).toLocaleTimeString(
                                "vi-VN",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">{getStatusBadge(event.status)}</td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {event.status === "UPCOMING" && (
                              <button
                                onClick={(e) => handleStartEvent(event.id, e)}
                                className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold"
                              >
                                <Play size={16} fill="currentColor" /> Bắt đầu
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // ✅ Sửa đường dẫn để trỏ đúng trang sửa sự kiện
                                navigate(`/admin/events/edit/${event.id}`);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expandedEventId === event.id && (
                        <tr className="bg-gray-50/50">
                          <td colSpan="6" className="p-0">
                            <div className="p-6 border-t border-gray-100">
                              {loadingDetails && !participantsMap[event.id] ? (
                                <div className="text-center py-4 text-gray-500">
                                  Đang tải danh sách người chơi...
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  {/* Cột 1: Người chiến thắng */}
                                  <div className="lg:col-span-1 space-y-4">
                                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Crown
                                          size={18}
                                          className="text-yellow-500"
                                        />{" "}
                                        Người chiến thắng
                                      </h4>

                                      {winners.length > 0 ? (
                                        <div className="space-y-3">
                                          {winners.map((winner) => (
                                            <div
                                              key={winner.id}
                                              className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-white p-3 rounded-lg border border-yellow-100"
                                            >
                                              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold border-2 border-yellow-200">
                                                <Trophy size={18} />
                                              </div>
                                              <div>
                                                <div className="font-bold text-gray-800">
                                                  {winner.user?.name ||
                                                    "Ẩn danh"}
                                                </div>
                                                <div className="text-xs text-yellow-600 font-bold">
                                                  Điểm số: {winner.score}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-gray-400 text-sm italic py-2">
                                          {event.status === "UPCOMING"
                                            ? "Cuộc thi chưa diễn ra"
                                            : "Chưa có người chiến thắng"}
                                        </div>
                                      )}
                                    </div>

                                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                      <h4 className="font-bold text-gray-800 mb-2">
                                        Thống kê
                                      </h4>
                                      <div className="text-sm text-gray-600 flex justify-between">
                                        <span>Tổng người tham gia:</span>
                                        <span className="font-bold">
                                          {participantsMap[event.id]?.length ||
                                            0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Cột 2 & 3: Bảng xếp hạng */}
                                  <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-gray-100 font-bold text-gray-800 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Medal
                                          size={18}
                                          className="text-emerald-500"
                                        />{" "}
                                        Bảng xếp hạng
                                      </div>
                                      <button
                                        onClick={(e) =>
                                          handleRefreshParticipants(e, event.id)
                                        }
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                                        title="Làm mới danh sách"
                                      >
                                        <RefreshCw size={16} />
                                      </button>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                      <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase sticky top-0">
                                          <tr>
                                            <th className="px-5 py-3 w-16 text-center">
                                              Hạng
                                            </th>
                                            <th className="px-5 py-3">
                                              Thí sinh
                                            </th>
                                            <th className="px-5 py-3 text-center">
                                              Điểm
                                            </th>
                                            <th className="px-5 py-3 text-right">
                                              Trạng thái
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                          {participantsMap[event.id]?.length >
                                          0 ? (
                                            participantsMap[event.id]
                                              .sort((a, b) => b.score - a.score)
                                              .map((p, index) => {
                                                // Check xem user này có phải winner không (để highlight)
                                                const isWinner = winners.some(
                                                  (w) => w.id === p.id
                                                );

                                                return (
                                                  <tr
                                                    key={p.id}
                                                    className={
                                                      isWinner
                                                        ? "bg-yellow-50/50"
                                                        : ""
                                                    }
                                                  >
                                                    <td className="px-5 py-3 text-center font-bold text-gray-400">
                                                      {index + 1}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                      <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                          {p.user?.avatarUrl ? (
                                                            <img
                                                              src={
                                                                p.user.avatarUrl
                                                              }
                                                              alt=""
                                                              className="w-full h-full object-cover"
                                                            />
                                                          ) : (
                                                            <User
                                                              size={14}
                                                              className="text-gray-500"
                                                            />
                                                          )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                          <span
                                                            className={`font-medium ${
                                                              isWinner
                                                                ? "text-yellow-700"
                                                                : "text-gray-700"
                                                            }`}
                                                          >
                                                            {p.user?.name ||
                                                              "Người chơi"}
                                                          </span>
                                                          <span className="text-xs text-gray-400">
                                                            {p.user?.username}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-center font-mono font-bold text-emerald-600">
                                                      {p.score}
                                                    </td>
                                                    <td className="px-5 py-3 text-right text-xs font-bold">
                                                      {isWinner && (
                                                        <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                                          WINNER
                                                        </span>
                                                      )}
                                                      {!isWinner &&
                                                        p.status ===
                                                          "ELIMINATED" && (
                                                          <span className="text-red-500 bg-red-50 px-2 py-1 rounded">
                                                            LOẠI
                                                          </span>
                                                        )}
                                                      {!isWinner &&
                                                        p.status ===
                                                          "ALIVE" && (
                                                          <span className="text-green-600 bg-green-50 px-2 py-1 rounded">
                                                            SỐNG
                                                          </span>
                                                        )}
                                                      {!isWinner &&
                                                        p.status ===
                                                          "JOINED" && (
                                                          <span className="text-gray-500">
                                                            Mới vào
                                                          </span>
                                                        )}
                                                      {!isWinner &&
                                                        p.status === "LEFT" && (
                                                          <span className="text-gray-400">
                                                            Đã thoát
                                                          </span>
                                                        )}
                                                    </td>
                                                  </tr>
                                                );
                                              })
                                          ) : (
                                            <tr>
                                              <td
                                                colSpan="4"
                                                className="p-5 text-center text-gray-400 text-sm"
                                              >
                                                Chưa có dữ liệu người chơi
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;