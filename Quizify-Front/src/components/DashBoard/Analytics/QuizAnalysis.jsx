import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import QuizWiseAnalysis from "./QuizWiseAnalysis/QuizWiseAnalysis";
import PollWiseAnalysis from "./PollWiseAnalysis/PollWiseAnalysis";
import { getQuizByid } from "../../../api/quiz";

const QuizAnalysis = () => {
  const { selectedQuizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizByid(selectedQuizId);
        setQuiz(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [selectedQuizId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Log quiz type to ensure it is being handled correctly

  return (
    <div>
      {quiz.type === "poll" ? <PollWiseAnalysis /> : <QuizWiseAnalysis />}
    </div>
  );
};

export default QuizAnalysis;
