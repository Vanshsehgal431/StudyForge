function StudyOverview({ activeSubjects }) {
  return (
    <section className="study-overview">
      <h2>Study Overview</h2>

      <div className="overview-list">
        <div className="overview-item">
          <span className="overview-icon">🕮</span>

          <div className="overview-info">
            <h3>{activeSubjects || 0}</h3>
            <p>Active Subjects</p>
          </div>
        </div>

        <div className="overview-item">
          <span className="overview-icon">🗹</span>

          <div className="overview-info">
            <h3>0</h3>
            <p>Topics Completed</p>
          </div>
        </div>

        <div className="overview-item">
          <span className="overview-icon">✌︎︎</span>

          <div className="overview-info">
            <h3>0</h3>
            <p>Day Streak</p>
          </div>
        </div>

        <div className="overview-item">
          <span className="overview-icon">🏅</span>

          <div className="overview-info">
            <h3>Begineer</h3>
            <p>League</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudyOverview;
