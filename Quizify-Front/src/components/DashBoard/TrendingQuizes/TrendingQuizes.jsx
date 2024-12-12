import { useEffect, useState } from "react";
import { getQuiz } from "../../../api/quiz";
import "./TrendingQuizes.css";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/constant";
import { useParams } from "react-router-dom"; // To access URL params

function TrendingQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionsCount, setQuestionsCount] = useState([]);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const { quizId } = useParams(); // Get the quizId from the URL

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await getQuiz();

        // Filter quizzes with more than 10 impressions
        const filteredQuizzes = data.filter((quiz) => quiz.impressions > 10);
        setQuizzes(filteredQuizzes);

        // Calculate total impressions
        const total = filteredQuizzes.reduce(
          (sum, quiz) => sum + (quiz.impressions || 0),
          0
        );
        setTotalImpressions(total);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    getQuizzes();
  }, []);

  useEffect(() => {
    if (!quizId) return; // Exit if no quizId is provided

    const incrementImpressions = async (quizId) => {
      try {
        console.log("Incrementing impressions for quiz:", quizId);
        await axios.post(
          `${BACKEND_URL}/api/quiz/increment-impressions/${quizId}`
        );
        console.log("Impressions incremented for quiz:", quizId);
      } catch (error) {
        console.error("Error incrementing impressions:", error);
      }
    };

    incrementImpressions(quizId);
  }, [quizId]); // Depend on quizId, so it only increments for the current quiz

  useEffect(() => {
    const getQuestionsCount = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/quiz/questions/count`
        );
        setQuestionsCount(response.data.count);
      } catch (error) {
        console.error("Error fetching question count:", error);
      }
    };
    getQuestionsCount();
  }, []);

  const formatDate = (dateString) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(dateString);
    const month = months[date.getMonth()];
    return `${date.getDate()} ${month.substring(0, 3)}, ${date.getFullYear()}`;
  };

  const formatImpressions = (impressions) => {
    if (impressions >= 1000) {
      return `${(impressions / 1000).toFixed(1)}k`;
    }
    return impressions;
  };

  return (
    <>
      <div className="dashboard-top">
        <div className="top-content qu">
          {quizzes.length}
          <span>Quiz</span>
          <h6>Created</h6>
        </div>
        <div className="top-content cr">
          {questionsCount} <span>questions</span>
          <h6>Created</h6>
        </div>
        <div className="top-content im">
          {formatImpressions(totalImpressions)}
          <span>Total</span>
          <h6>Impressions</h6>
        </div>
      </div>
      <div className="quiz-container">
        <h1 className="trending-quiz-title">Trending Quizzes</h1>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {!loading && (
          <div className="quizzes">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz">
                <h2>{quiz.title}</h2>
                <span className="impressions">
                  {formatImpressions(quiz.impressions)}
                </span>
                <img src="./images/eyes.png" alt="impressions" />
                <p>Created on: {formatDate(quiz.date)}</p>
              </div>
            ))}
          </div>
        )}
  
     
      </div>
    </>
  );
}

export default TrendingQuizzes;
