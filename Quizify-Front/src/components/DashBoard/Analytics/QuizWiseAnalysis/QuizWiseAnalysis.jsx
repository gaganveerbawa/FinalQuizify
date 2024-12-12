import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizByid } from "../../../../api/quiz";
import { getQuestions } from "../../../../api/question";
import "./QuizWiseAnalysis.css";

function QuizWiseAnalysis() {
  const { id } = useParams(); // Get the quiz ID from the URL
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizByid(id);
        setQuiz(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions(id);
        console.log("questions", response.data); // Log questions data for debugging
        setQuestions(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchQuestions();
    }
  }, [id]);

  return (
    <div className="quiz-analysis-container">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && quiz && (
        <div className="quiz-item">
          <p className="quizName">{quiz.title} Question Analysis</p>
          <div className="quiz-details">
            <p>Created on: {new Date(quiz.date).toLocaleDateString()}</p>
            <p>Impressions: {quiz.impressions}</p>
          </div>
        </div>
      )}
      {!loading && questions.length > 0 && (
        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={index} className="question-item">
              <p className="quiz-question">
                Q.{index + 1} {question.question}
              </p>
              <div className="question-analysis">
                <div className="analysis-container">
                  <span>{question.correctCount + question.incorrectCount}</span>
                  <span>people Attempted the question</span>
                </div>
                <div className="analysis-container">
                  <span>{question.correctCount}</span>
                  <span>people Answered Correctly</span>
                </div>
                <div className="analysis-container">
                  {" "}
                  <span>{question.incorrectCount}</span>
                  <span>people Answered Incorrectly</span>
                </div>
              </div>
              <div className="horizontal-line"></div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && questions.length === 0 && (
        <div>No questions found for this quiz q&a.</div>
      )}
    </div>
  );
}

export default QuizWiseAnalysis;
