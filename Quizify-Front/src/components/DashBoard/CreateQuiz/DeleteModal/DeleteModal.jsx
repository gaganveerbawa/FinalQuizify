/* eslint-disable react/prop-types */
import "./DeleteModal.css"; // Import CSS if needed

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="quiz-overlay">
      <div className="delete-content">
        <p className="delete-msg">
          Are you Confirm you <br />
          want to delete this ?
        </p>
        <div className="delete-buttons">
          <button className="delete-button" onClick={onDelete}>
            Confirm Delete
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
