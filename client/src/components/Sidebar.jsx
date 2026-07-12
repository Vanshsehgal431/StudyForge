import { FiBook, FiClipboard, FiHome, FiLogOut, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <h2 className="logo">StudyForge</h2>

        <nav>
          <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
            <FiHome /> Dashboard
          </Link>

          <Link to="/notes" onClick={() => setSidebarOpen(false)}>
            <FiClipboard /> Notes
          </Link>

          <Link to="/courses" onClick={() => setSidebarOpen(false)}>
            <FiBook /> Courses
          </Link>

          <Link to="/profile" onClick={() => setSidebarOpen(false)}>
            <FiUser /> Profile
          </Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          <FiLogOut /> Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
