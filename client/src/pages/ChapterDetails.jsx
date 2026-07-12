import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ChapterDetails() {
  const { subjectId, chapterId } = useParams();

  const [chapter, setChapter] = useState(null);
  const [subject, setSubject] = useState(null);

  const [topics, setTopics] = useState([]);
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  const progress = useMemo(() => {
    if (topics.length === 0) return 0;

    const completed = topics.filter((topic) => topic.completed).length;

    return Math.round((completed / topics.length) * 100);
  }, [topics]);

  const fetchChapter = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/chapters/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setChapter(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubject = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/subjects/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSubject(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/topics/chapter/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setTopics(data);

      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/resources/chapter/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setResources(data);

      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const generateRoadmap = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/ai/generate/${chapterId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const toggleItem = (topicId) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic._id === topicId
          ? { ...topic, completed: !topic.completed }
          : topic,
      ),
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([fetchChapter(), fetchSubject()]);

        let topicData = await fetchTopics();

        if (topicData.length === 0) {
          await generateRoadmap();

          await fetchTopics();
        }

        await fetchResources();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [chapterId, subjectId]);

  if (loading) {
    return (
      <div className="chapter-page">
        <div className="chapter-shell">
          <p className="chapter-status">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!chapter || !subject) {
    return (
      <div className="chapter-page">
        <div className="chapter-shell">
          <p className="chapter-status">Couldn't find this chapter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chapter-page">
      <div className="chapter-shell">
        {/* Breadcrumb */}
        <div className="chapter-breadcrumb">
          <Link to={`/courses/${subjectId}`} className="breadcrumb-link">
            {subject.name}
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{chapter.name}</span>
        </div>

        {/* Header */}
        <header className="chapter-header">
          <div className="chapter-title-row">
            <span className="chapter-icon" aria-hidden="true">
              {"📖"}
            </span>
            <h1 className="chapter-title">{chapter.name}</h1>
          </div>

          <div className="chapter-progress">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-label">{progress}%</span>
          </div>
        </header>

        <div className="chapter-grid">
          {/* Study Roadmap */}
          <section className="chapter-card">
            <h2 className="card-heading">Study Roadmap</h2>
            {topics.length === 0 ? (
              <p className="chapter-empty">No topics added yet.</p>
            ) : (
              <ul className="roadmap-list">
                {topics.map((topic) => (
                  <li key={topic._id} className="roadmap-item">
                    <button
                      type="button"
                      className={`roadmap-check ${topic.completed ? "is-done" : ""}`}
                      onClick={() => toggleItem(topic._id)}
                      aria-pressed={topic.completed}
                      aria-label={`Mark "${topic.title}" as ${
                        topic.completed ? "not done" : "done"
                      }`}
                    >
                      {topic.completed ? "✓" : ""}
                    </button>
                    <span
                      className={`roadmap-label ${topic.completed ? "is-done" : ""}`}
                    >
                      {topic.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="chapter-card">
            <h2 className="card-heading">Resources</h2>
            {resources.length === 0 ? (
              <p className="chapter-empty">No resources added yet.</p>
            ) : (
              <ul className="resource-list">
                {resources.map((res) => (
                  <li key={res._id} className="resource-item">
                    <a
                      href={res.url}
                      className="resource-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="resource-icon" aria-hidden="true">
                        {"🔗"}
                      </span>
                      {res.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="chapter-card chapter-card--wide">
            <h2 className="card-heading">Notes</h2>
            <textarea
              className="notes-area"
              placeholder="Jot down key ideas, formulas, or things to revisit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default ChapterDetails;
