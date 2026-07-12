import { FiMenu } from "react-icons/fi";

function Navbar({ user, sidebarOpen, setSidebarOpen }) {
  return (
    <header className="navbar">
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FiMenu size={24} />
      </button>

      <h2>Dashboard</h2>

      <div className="navbar-user">{user?.fullName}</div>
    </header>
  );
}

export default Navbar;
