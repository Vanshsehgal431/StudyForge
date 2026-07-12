import axios from "axios";
import { useState } from "react";

function CreateChapterModal({ isOpen, onClose, subjectId, onChapterCreated }) {
  const [name, setName] = useState("");
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5000/api/chapters/subject/${subjectId}`,
        {
          name: name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);
      await onChapterCreated();

      setName("");
      onClose();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to create chapter.");
    }
  };
  return (
    <div className="modal-overlay">
      <div className="subject-modal">
        <h2>Create New Chapter</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chapter Name</label>

            <input
              type="text"
              placeholder="Enter chapter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="create-btn">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChapterModal;
