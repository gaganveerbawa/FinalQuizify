/* eslint-disable react/prop-types */
// Quiz.jsx
import "./QuizModal.css"; // Update the CSS file name

function QuizModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="quiz-overlays">
      <div className="quiz-contents" onClick={(e) => e.stopPropagation()}>
        <button className="quiz-closes" onClick={onClose}>
          cancel
        </button>
        {children}
      </div>
    </div>
  );
}

export default QuizModal;
