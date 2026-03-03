import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";

// --- Admin Pages ---
import Dashboard from "./modules/admin/pages/Dashboard";
import TopicList from "./modules/admin/topic/TopicList";
import AddTopic from "./modules/admin/topic/AddTopic";
import EditTopic from "./modules/admin/topic/EditTopic";
import QuestionManager from "./modules/admin/questions/QuestionManager";
import CreateEvent from "./modules/admin/events/CreateEvent";
import EventList from "./modules/admin/events/EventList";
import AdminLogin from "./modules/admin/auth/AdminLogin";
import PrivateRoute from "./modules/admin/components/PrivateRoute";
// Radio Admin
import RadioManager from "./modules/admin/radio/RadioManager";
import RadioCreate from "./modules/admin/radio/RadioCreate";
import RadioEdit from "./modules/admin/radio/RadioEdit";

// --- Client Pages & Components ---
import LandingPage from "./modules/client/components/LandingPage";
import Onboarding from "./modules/client/components/Onboarding";
import TopicSelection from "./modules/client/pages/TopicSelection";
import PlayScreen from "./modules/client/pages/PlayScreen";
import AddTopicFromClient from "./modules/client/pages/AddTopicClient";
import LiveBattle from "./modules/client/pages/LiveBattle";
import Login from "./modules/client/pages/Login";
import Register from "./modules/client/pages/Register";
import Profile from "./modules/client/pages/Profile";
import ClientEventList from "./modules/client/pages/ClientEventList";
import GlobalEventBanner from "./modules/client/components/GlobalEventBanner";
import EditEvent from "./modules/admin/events/EditEvent";
import VietnamJourneyMap from "./modules/client/components/VietnamJourneyMap";

// --- Admin Map Pages ---
import MapRegionList from "./modules/admin/map/MapRegionList";
import AddRegion from "./modules/admin/map/AddRegion";
import EditRegion from "./modules/admin/map/EditRegion";

// ✅ Import Component Nút Nổi
import MapFloatingButton from "./modules/client/components/MapFloatingButton";

// ✅ CẬP NHẬT IMPORTS CHO QUIZ SYSTEM
import QuizJoin from "./modules/client/pages/QuizJoin";
import MyQuizzes from "./modules/client/pages/MyQuizzes";
import CreateQuiz from "./modules/client/pages/CreateQuiz";
import QuizGame from "./modules/client/pages/QuizGame";
import EditQuiz from "./modules/client/pages/EditQuiz";

// ✅ IMPORT GACHA SCREEN
import GachaScreen from "./modules/client/pages/GachaScreen"; 
import UserManager from "./modules/admin/users/UserManager";
import GachaList from "./modules/admin/gacha/GachaList";
import GachaCreate from "./modules/admin/gacha/GachaCreate";
import GachaEdit from "./modules/admin/gacha/GachaEdit";
import EditProfile from "./modules/client/pages/EditProfile";
import Marketplace from "./modules/client/pages/Marketplace";

// ✅ IMPORT RADIO (MỚI THÊM)
import RadioPage from "./modules/client/pages/RadioPage";
import { RadioProvider } from "./modules/client/context/RadioContext"; // <-- Quan trọng: Bọc Context
import RetroRadio from "./modules/client/components/RetroRadio"; // <-- Quan trọng: Cái đài

// Component phụ để ẩn Banner khi đang trong trận đấu hoặc vòng quay
function BannerWrapper() {
  const location = useLocation();
  if (
    location.pathname.startsWith("/live-battle/") || 
    location.pathname.startsWith("/quiz/") ||
    location.pathname === "/gacha" // ✅ Ẩn banner ở trang Gacha
  ) {
    return null;
  }
  return <GlobalEventBanner />;
}

function App() {
  return (
    // ✅ 1. BỌC TOÀN BỘ APP TRONG RADIO PROVIDER
    <RadioProvider>
      <BrowserRouter>
        {/* Banner toàn cục */}
        <BannerWrapper />
        
        {/* Nút nổi bản đồ */}
        <MapFloatingButton />

        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tutorial" element={<Onboarding />} />
          <Route path="/events" element={<ClientEventList />} />

          {/* ================= GACHA (Test) ================= */}
          <Route path="/gacha" element={<GachaScreen />} /> 

          {/* ================= AUTH ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />

          {/* ================= GAME (Cũ) ================= */}
          <Route path="/game/:topicId" element={<PlayScreen />} />

          {/* ================= THI ĐÌNH ================= */}
          <Route path="/live-battle/:id" element={<LiveBattle />} />

          {/* ================= MAP ================= */}
          <Route path="/vietnam-map" element={<VietnamJourneyMap />} />
          
          {/* ================= CLIENT LAYOUT ================= */}
          <Route path="/topic" element={<ClientLayout />}>
            <Route index element={<TopicSelection />} />
            <Route path="create" element={<AddTopicFromClient />} />
          </Route>

          {/* ================= QUIZ GAME SYSTEM (Mới) ================= */}
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/my-quizzes" element={<MyQuizzes />} />
          <Route path="/quiz/join" element={<QuizJoin />} />
          <Route path="/quiz/:roomCode" element={<QuizGame />} />
          <Route path="/edit-quiz/:id" element={<EditQuiz />} />

          <Route path="/market-place" element={<Marketplace />} />

          {/* ✅ ROUTE CHO ĐÀI PHÁT THANH CLIENT */}
          <Route path="/radio" element={<RadioPage />} />

          {/* ================= ADMIN (PROTECTED) ================= */}
          <Route element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="topics" element={<TopicList />} />
              <Route path="add-topic" element={<AddTopic />} />
              <Route path="edit-topic/:id" element={<EditTopic />} />

              <Route path="questions" element={<QuestionManager />} />

              {/* Events */}
              <Route path="events" element={<EventList />} />
              <Route path="events/create" element={<CreateEvent />} />
              <Route path="events/edit/:id" element={<EditEvent />} />

              {/* QUẢN LÝ BẢN ĐỒ */}
              <Route path="region" element={<MapRegionList />} />
              <Route path="region/add" element={<AddRegion />} />
              <Route path="region/edit/:id" element={<EditRegion />} />

              <Route path="users" element={<UserManager />} />

              <Route path="gachas" element={<GachaList />} />
              <Route path="gachas/new" element={<GachaCreate />} />
              <Route path="gachas/edit/:id" element={<GachaEdit />} />

              {/* ✅ QUẢN LÝ RADIO */}
              <Route path="radio" element={<RadioManager />} />
              <Route path="radio/new" element={<RadioCreate />} />
              <Route path="radio/edit/:id" element={<RadioEdit />} />
              
            </Route>
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* ✅ 2. ĐẶT COMPONENT RADIO Ở ĐÂY ĐỂ NÓ LUÔN HIỂN THỊ */}
        <RetroRadio />

      </BrowserRouter>
    </RadioProvider>
  );
}

export default App;