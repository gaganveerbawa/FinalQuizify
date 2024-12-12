import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "./QuizCard";
import { getQuiz } from "./api/quiz"; // Adjust path as necessary

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch quizzes from backend when component mounts
    const fetchQuizzes = async () => {
      try {
        const fetchedQuizzes = await getQuiz();
        setQuizzes(fetchedQuizzes);
      } catch (e) {
        console.error("Failed to fetch quizzes:", e);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`); // Navigate to quiz start page with quiz ID
  };

  
  return (
    <div className="p-6">
      {/* Responsive grid layout for QuizCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              title={quiz.title}
              type={quiz.type}
              date={quiz.date}
              impressions={quiz.impressions}
              onStart={() => handleStartQuiz(quiz._id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No quizzes available</p>
        )}
      </div>
    </div>
  );
}
