import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateSubjectModal from "../components/CreateSubjectModal";
import Sidebar from "../components/Sidebar";
import "../styles/Subjects.css";
const api = import.meta.env.VITE_API_URL;
const API_URL = `${api}/api/subjects`;

function Subjects() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete subject");

      setSubjects((prev) => prev.filter((subject) => subject._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  const fetchSubjects = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSubjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);

      await fetchSubjects();

      setLoading(false);
    };

    loadSubjects();
  }, []);
  return (
    <div className="dashboard">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="dashboard-content">
        <div className="subjects-header">
          <div>
            <h1>Subjects</h1>
            <p>Manage all your study subjects.</p>
          </div>

          <button
            className="add-subject-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + New Subject
          </button>
        </div>

        {error && <p className="subjects-error">{error}</p>}

        {loading ? (
          <p className="subjects-empty">Loading subjects…</p>
        ) : subjects.length === 0 ? (
          <p className="subjects-empty">
            No subjects yet — create your first one to get started.
          </p>
        ) : (
          <div className="subjects-container">
            {subjects.map((subject) => (
              <div
                className="subject-card"
                key={subject._id}
                onClick={() => navigate(`/subjects/${subject._id}`)}
              >
                <h3>{subject.name}</h3>
                <p>Organize your notes for this subject.</p>

                <div className="subject-footer">
                  <span className="subject-notes">0 Notes</span>

                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(subject._id);
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubjectCreated={fetchSubjects}
      />
    </div>
  );
}

export default Subjects;
