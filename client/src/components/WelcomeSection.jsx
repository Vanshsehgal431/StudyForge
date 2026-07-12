function WelcomeSection({ user, activeSubjects, onNewSubject }) {
  return (
    <section className="welcome-section">
      <div className="welcome-content">
        <h1>Welcome Back, {user?.fullName || "Student"}</h1>
        <p>
          Stay consistent. Every topic you complete brings you one step closer
          to your goal.
        </p>
        <span className="subject-count">
          {activeSubjects > 0
            ? `${activeSubjects} Active Subjects`
            : "No Subjects Yet"}
        </span>
      </div>

      <button className="new-subject-btn" onClick={onNewSubject}>
        + New Subject
      </button>
    </section>
  );
}

export default WelcomeSection;
