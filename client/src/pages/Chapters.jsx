import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateChapterModal from "../components/CreateChapterModal";
import Sidebar from "../components/Sidebar";

// // import "../styles/Chapters.css";
const API_URL = import.meta.env.VITE_API_URL;
function Chapters() {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchChapters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chapters/subject/${subjectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setChapters(data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchSubject = async () => {
    try {
      const res = await fetch(`${API_URL}/api/subjects/${subjectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      setSubject(data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chapter?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete subject");

      setChapters((prev) => prev.filter((chapter) => chapter._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchSubject(), fetchChapters()]);

      setLoading(false);
    };
    loadData();
  }, [subjectId]);
  return (
    <div className="dashboard">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="dashboard-content">
        <div className="subjects-header">
          <div>
            <h1>{loading ? "Loading..." : subject?.name}</h1>
            <p>Manage chapters for this subject.</p>
          </div>

          <button
            className="add-subject-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + New Chapter
          </button>
        </div>

        <p className="subject-id">Subject ID: {subjectId}</p>

        <div className="subjects-container">
          {loading ? (
            <p>Loading chapters...</p>
          ) : chapters.length === 0 ? (
            <p>No chapters yet. Create your first chapter.</p>
          ) : (
            chapters.map((chapter) => (
              <div
                className="subject-card"
                key={chapter._id}
                onClick={() => navigate(`/courses/${subjectId}/${chapter._id}`)}
              >
                <h3>{chapter.name}</h3>
                <p>Click to open this chapter.</p>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(chapter._id);
                  }}
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <CreateChapterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjectId={subjectId}
        onChapterCreated={fetchChapters}
      />
    </div>
  );
}

export default Chapters;
