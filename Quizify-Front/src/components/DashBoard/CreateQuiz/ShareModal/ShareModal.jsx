import { useNavigate, useParams } from "react-router-dom";
import "./ShareModal.css"; // Ensure to import your CSS file
import toast from "react-hot-toast";

function ShareModal({ onClose }) {
  const navigate = useNavigate();
  const params = useParams();
  const fullPath = params["*"];
  const quizId = fullPath.split("/").pop();
  const linkToShare = `${window.location.origin}/quiz/${quizId}/questions/view`;

  const handleClose = () => {
    onClose(); // Call onClose to handle any additional logic
    navigate("/dashboard"); // Navigate to /dashboard
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-title">
          Congrats your Quiz is <br />
          Published!
        </p>
        <input
          type="text"
          readOnly
          className="modal-input"
          value="your link is here"
        />
        <button
          className="modal-copy"
          onClick={() => {
            navigator.clipboard.writeText(linkToShare);
            toast.success("Link Copied");
          }}
        >
          Share
        </button>
        <button className="modal-close" onClick={handleClose}>
          X
        </button>
      </div>
    </div>
  );
}

export default ShareModal;
