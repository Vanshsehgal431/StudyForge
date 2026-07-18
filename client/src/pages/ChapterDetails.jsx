import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../styles/ChapterDetails.module.css";
const API_URL = import.meta.env.VITE_API_URL;

function ChapterDetails() {
  const { subjectId, chapterId } = useParams();

  const [chapter, setChapter] = useState(null);
  const [subject, setSubject] = useState(null);

  const [topics, setTopics] = useState([]);
  const [resources, setResources] = useState([]);
  const [notesFiles, setNotesFiles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [uploadingNote, setUploadingNote] = useState(false);

  const fileInputRef = useRef(null);

  const progress = useMemo(() => {
    if (topics.length === 0) return 0;

    const completed = topics.filter((topic) => topic.completed).length;

    return Math.round((completed / topics.length) * 100);
  }, [topics]);

  const fetchChapter = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chapters/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

  const fetchTopics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/topics/chapter/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
      const res = await fetch(`${API_URL}/api/resources/chapter/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notes/chapter/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setNotesFiles(data);

      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const generateRoadmap = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ai/generate/${chapterId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingNote(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);

      const res = await fetch(`${API_URL}/api/notes/chapter/${chapterId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      await fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingNote(false);
      e.target.value = "";
    }
  };

  const deleteNote = async (noteId) => {
    const prevNotes = [...notesFiles];

    setNotesFiles((prev) => prev.filter((note) => note._id !== noteId));

    try {
      const res = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      setNotesFiles(prevNotes);
    }
  };

  const viewNote = async (noteId) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${noteId}/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      window.open(data.url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to open note.");
    }
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

        await Promise.all([fetchResources(), fetchNotes()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [chapterId, subjectId]);

  if (loading) {
    return (
      <div className={styles.studyArena}>
        <div className={styles.studyContainer}>
          <p className={styles.statusMessage}>Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!chapter || !subject) {
    return (
      <div className={styles.studyArena}>
        <div className={styles.studyContainer}>
          <p className={styles.statusMessage}>Couldn't find this chapter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.studyArena}>
      <div className={styles.studyContainer}>
        {/* Breadcrumb */}
        <div className={styles.navTrail}>
          <Link to={`/courses/${subjectId}`} className={styles.trailLink}>
            {subject.name}
          </Link>
          <span className={styles.trailSeparator}>/</span>
          <span className={styles.trailCurrent}>{chapter.name}</span>
        </div>

        {/* Header */}
        <header className={styles.studyHeader}>
          <div className={styles.headerTitleRow}>
            <span className={styles.headerIcon} aria-hidden="true">
              {"📖"}
            </span>
            <h1 className={styles.studyTitle}>{chapter.name}</h1>
          </div>

          <div className={styles.completionGauge}>
            <div className={styles.gaugeTrack}>
              <div
                className={styles.gaugeFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.gaugeLabel}>{progress}%</span>
          </div>
        </header>

        <div className={styles.contentGrid}>
          {/* Study Roadmap */}
          <section className={styles.contentBlock}>
            <h2 className={styles.blockHeading}>Study Roadmap</h2>
            {topics.length === 0 ? (
              <p className={styles.emptyState}>No topics added yet.</p>
            ) : (
              <ul className={styles.milestoneTrack}>
                {topics.map((topic) => (
                  <li key={topic._id} className={styles.milestoneItem}>
                    <button
                      type="button"
                      className={`${styles.checkboxMarker} ${
                        topic.completed ? styles.isDone : ""
                      }`}
                      onClick={() => toggleItem(topic._id)}
                      aria-pressed={topic.completed}
                      aria-label={`Mark "${topic.title}" as ${
                        topic.completed ? "not done" : "done"
                      }`}
                    >
                      {topic.completed ? "✓" : ""}
                    </button>
                    <span
                      className={`${styles.milestoneLabel} ${
                        topic.completed ? styles.isDone : ""
                      }`}
                    >
                      {topic.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.contentBlock}>
            <h2 className={styles.blockHeading}>Resources</h2>
            {resources.length === 0 ? (
              <p className={styles.emptyState}>No resources added yet.</p>
            ) : (
              <ul className={styles.resourceHub}>
                {resources.map((res) => (
                  <li key={res._id} className={styles.resourceItem}>
                    <a
                      href={res.url}
                      className={styles.resourceLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className={styles.resourceIcon} aria-hidden="true">
                        {"🔗"}
                      </span>
                      {res.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes */}
          <section className={`${styles.contentBlock} ${styles.blockWide}`}>
            <div className={styles.blockHeadingRow}>
              <h2 className={styles.blockHeading}>📄 Notes</h2>
              <button
                type="button"
                className={styles.uploadNoteButton}
                onClick={handleUploadClick}
                disabled={uploadingNote}
              >
                {uploadingNote ? "Uploading..." : "+ Upload Note"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                hidden
                onChange={handleFileChange}
              />
            </div>

            {notesFiles.length === 0 ? (
              <p className={styles.emptyState}>No notes uploaded yet.</p>
            ) : (
              <ul className={styles.documentVault}>
                {notesFiles.map((note) => (
                  <li key={note._id} className={styles.documentItem}>
                    <div className={styles.documentLinkWrapper}>
                      <span className={styles.documentIcon} aria-hidden="true">
                        📄
                      </span>
                      <button
                        type="button"
                        className={styles.documentLink}
                        onClick={() => viewNote(note._id)}
                      >
                        {note.title}
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.documentDelete}
                      onClick={() => deleteNote(note._id)}
                      aria-label={`Delete "${note.title}"`}
                    >
                      🗑
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ChapterDetails;
