/* eslint-disable react/prop-types */
// Quiz.jsx
import "./Quiz.css"; // Update the CSS file name

function Quiz({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="quiz-overlay">
      <div className="quiz-content" onClick={(e) => e.stopPropagation()}>
        <button className="quiz-close" onClick={onClose}>
          cancel
        </button>
        {children}
      </div>
    </div>
  );
}

export default Quiz;
