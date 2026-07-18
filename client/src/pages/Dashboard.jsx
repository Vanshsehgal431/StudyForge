import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateSubjectModal from "../components/CreateSubjectModal";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StudyOverview from "../components/StudyOverview";
import SubjectList from "../components/SubjectList";
import WelcomeSection from "../components/WelcomeSection";
import "../styles/dashboard.css";
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");

    const dashboardRes = await axios.get(`${API_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDashboard(dashboardRes.data);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        await fetchDashboard();
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="dashboard">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="dashboard-content">
        <Navbar
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div>
          <WelcomeSection
            user={user}
            activeSubjects={dashboard?.activeSubjects}
            onNewSubject={() => setIsModalOpen(true)}
          />
        </div>
        <div>
          <SubjectList subjects={dashboard?.subjects} />
        </div>
        <div>
          <StudyOverview activeSubjects={dashboard?.activeSubjects} />
        </div>
        <div className="recent">
          <h2>Recent Activity</h2>
          <p>No recent activity.</p>
        </div>

        <button className="logout-under-recent" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <CreateSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubjectCreated={fetchDashboard}
      />
    </div>
  );
}

export default Dashboard;
