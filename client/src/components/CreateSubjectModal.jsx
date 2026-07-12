import axios from "axios";
import { useState } from "react";

function CreateSubjectModal({ isOpen, onClose, onSubjectCreated }) {
  const [name, setName] = useState("");
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/subjects",
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
      await onSubjectCreated();

      setName("");
      onClose();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to create subject.");
    }
  };
  return (
    <div className="modal-overlay">
      <div className="subject-modal">
        <h2>Create New Subject</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject Name</label>

            <input
              type="text"
              placeholder="Enter subject name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose}>
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

export default CreateSubjectModal;
