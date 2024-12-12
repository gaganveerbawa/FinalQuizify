import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPollQuestions } from "../../api/pollQuestion";
import toast from "react-hot-toast";
import "./GetPollQuestions.css";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";

function GetPollQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { quizId } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getPollQuestions(quizId);
        setQuestions(response.data);
      } catch (error) {
        toast.error("Error fetching poll questions");
        console.error("Error fetching poll questions:", error);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = async (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    const selectedOption = updatedQuestions[questionIndex].options[optionIndex];

    selectedOption.votes += 1;
    setQuestions(updatedQuestions);

    // Optionally, if you need to track the selected option by its _id:
    setSelectedOption(selectedOption._id);

    try {
      await axios.patch(
        `${BACKEND_URL}/api/quiz/pollQuestion/${questions[questionIndex].id}/options/${selectedOption._id}`,
        {
          votes: selectedOption.votes,
        }
      );
      toast.success("Vote submitted successfully!");
      console.log("Updated Questions Array:", updatedQuestions);
    } catch (error) {
      toast.error("Error submitting vote");
      console.error("Error submitting vote:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="quiz-container">
      {!quizCompleted ? (
        <>
          <span className="questions-index">
            {currentQuestionIndex}/{questions.length}
          </span>
          {currentQuestion && (
            <div>
              <h2 className="question">{currentQuestion.question}</h2>
              <ul className="options">
                {currentQuestion.options.map((option, index) => (
                  <li key={index} className="option-item">
                    <button
                      onClick={() =>
                        handleOptionClick(currentQuestionIndex, index)
                      }
                      className={`option-button ${
                        selectedOption === option._id ? "selected" : ""
                      }`} // Compare with option._id
                    >
                      {option.imageURL ? (
                        <div className="option-content">
                          <img
                            src={option.imageURL}
                            alt={option.text}
                            className="option-image"
                          />
                          {option.text && (
                            <span className="option-text">{option.text}</span>
                          )}
                        </div>
                      ) : (
                        <span className="option-text">{option.text}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleNextQuestion}
                className="next-button"
                disabled={!selectedOption}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="end-container">
          <p className="end-title">Thank you for participating in the Poll</p>
        </div>
      )}
    </div>
  );
}

export default GetPollQuestions;
