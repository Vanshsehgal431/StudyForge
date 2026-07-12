function SubjectList({ subjects }) {
  return (
    <section className="subject-section">
      <div className="subject-content">
        <h1 className="headline">Your Subjects</h1>
        {subjects && subjects.length > 0 ? (
          <ul>
            {subjects.map((subject) => (
              <li key={subject._id}>{subject.name}</li>
            ))}
          </ul>
        ) : (
          <p>No subjects found.</p>
        )}
      </div>
    </section>
  );
}

export default SubjectList;
