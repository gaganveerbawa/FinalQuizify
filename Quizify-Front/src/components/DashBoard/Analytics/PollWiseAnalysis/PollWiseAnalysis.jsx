import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizByid } from "../../../../api/quiz";
import { getPollQuestions } from "../../../../api/pollQuestion";
import "./PollWiseAnalysis.css";

function PollWiseAnalysis() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
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
      fetchPoll();
    }
  }, [id]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getPollQuestions(id);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
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
              <div className="poll-container">
                {question.options.map((option) => (
                  <div key={option._id} className="analysis-container">
                    <div className="poll-options">
                      <p className="poll-vote">{option.votes}</p>
                      {option.imageURL && (
                        <img
                          src={option.imageURL}
                          alt={option.text}
                          className="option-image"
                        />
                      )}
                      <p>{option.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="horizontal-line"></div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && questions.length === 0 && (
        <div>No questions found for this quiz. poll type</div>
      )}
    </div>
  );
}

export default PollWiseAnalysis;
 