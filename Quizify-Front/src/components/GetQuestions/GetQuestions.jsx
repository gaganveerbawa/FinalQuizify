import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestions, evaluationCount } from "../../api/question";
import toast from "react-hot-toast";
import "./GetQuestions.css";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";

function GetQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { quizId } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    console.log("quizId from GetQues", quizId);
    const incrementImpressions = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/quiz/increment-impressions/${quizId}`
        );
        console.log("Impressions incremented:", response.data);
      } catch (error) {
        console.error("Failed to increment impressions:", error);
      }
    };

    incrementImpressions();

    const renderQuestions = async () => {
      try {
        const response = await getQuestions(quizId);
        setQuestions(response.data);
        console.log("Fetched questions:", response.data);
      } catch (error) {
        toast.error("Failed to fetch questions");
        console.error(error);
      }
    };
    renderQuestions();
  }, [quizId]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex === 0) {
      const timerValue = parseInt(questions[0].timer, 10);
      setTimeLeft(isNaN(timerValue) ? null : timerValue);
    }
  }, [questions]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && questions.length > 0 && !quizCompleted) {
      handleNextQuestion(true);
    }
  }, [timeLeft, questions, quizCompleted]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log("Option clicked:", option);
  };

  const updateCount = async (questionId, isCorrect) => {
    console.log("isCorrect", isCorrect);

    try {
      const response = await evaluationCount(questionId, isCorrect);
      console.log("Updated count:", response.data);
    } catch (error) {
      toast.error("Failed to update count");
      console.error(error);
    }
  };

  const handleNextQuestion = (isTimerEnd = false) => {
    if (quizCompleted) return;

    const currentQuestion = questions[currentQuestionIndex];

    if (!isTimerEnd && !selectedOption) return;

    // Determine the correct answer
    const correctOption = currentQuestion.correctOption;

    // Debugging logs
    console.log("Correct Option:", correctOption);
    console.log("Selected Option Text:", selectedOption?.text);

    // Evaluate whether the selected option is correct
    const isCorrect =
      (String(selectedOption?.text).trim().toLowerCase() ===
        String(correctOption).trim().toLowerCase() ||
        correctOption === null) &&
      (selectedOption?.imageURL === currentQuestion.correctImageURL ||
        currentQuestion.correctImageURL === null);

    console.log("Is Correct:", isCorrect);
    if (selectedOption?.text === correctOption) {
      setScore((prevScore) => prevScore + 1);
    }
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    updateCount(currentQuestion.id, isCorrect);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      const nextTimer = questions[currentQuestionIndex + 1].timer;
      setTimeLeft(nextTimer === "off" ? null : parseInt(nextTimer, 10) || 0);
    } else {
      const finalScore = isCorrect ? score + 1 : score;
      setQuizCompleted(true);
      console.log("Final score:", finalScore);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      {!quizCompleted ? (
        <>
          <h1 className="quiz-title">Quiz Questions</h1>
          <span className="questions-index">
            {currentQuestionIndex}/{questions.length}
          </span>
          {currentQuestion ? (
            <div>
              {timeLeft !== null && timeLeft >= 0 && (
                <h4 className="timer">Timer: {timeLeft}</h4>
              )}
              <h2 className="question">{currentQuestion.question}</h2>
              <ul className="options">
                {currentQuestion.options.map((option, index) => (
                  <li key={index} className="option-item">
                    <button
                      onClick={() => handleOptionClick(option)}
                      className={`option-button ${
                        selectedOption === option ? "selected" : ""
                      }`}
                    >
                      {option.imageURL ? (
                        <div className="option-content">
                          <img
                            src={option.imageURL}
                            alt="Option"
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
                onClick={() => handleNextQuestion(false)}
                className="next-button"
                disabled={!selectedOption}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </>
      ) : (
        <div className="congratulations-container">
          <h2>Congrats Quiz is completed!</h2>
          <img src="/images/tropy.png" alt="tropy" />
          <p className="score-title">
            Your Score is{" "}
            <span className="score">
              0{score}/0{questions.length}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default GetQuestions;
