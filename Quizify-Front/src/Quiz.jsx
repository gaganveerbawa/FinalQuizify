import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestions } from "./api/question";
import { incrementQuizImpressions } from "./api/quiz"; // Import the new method
import 'tailwindcss/tailwind.css';

const Quiz = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions(quizId);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  // Handle answer selection
  const handleSelectAnswer = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let totalScore = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctOption) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
    setSubmitted(true);

    // Increment quiz impressions after submitting the quiz
    try {
      await incrementQuizImpressions(quizId);
      console.log("Impressions incremented successfully.");
    } catch (error) {
      console.error("Error incrementing impressions:", error);
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quiz Questions</h1>
      {!submitted ? (
        <div className="space-y-6">
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className="bg-white p-4 shadow rounded-md">
                <p className="font-semibold">{question.question}</p>
                <div className="mt-2 space-y-2">
                  {question.options.map((option) => (
                    <label key={option._id} className="block">
                      <input
                        type="radio"
                        name={question.id}
                        value={option.text}
                        checked={selectedAnswers[question.id] === option.text}
                        onChange={() => handleSelectAnswer(question.id, option.text)}
                        className="mr-2"
                      />
                      {option.text}
                    </label>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Quiz Completed!</h2>
          <p className="text-lg mt-2">Your Score: {score}/{questions.length}</p>
          <p>Thank you for playing!</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getQuestions } from "./api/question";

// const Quiz = () => {
//     const { quizId } = useParams();
//     const [questions, setQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 const response = await getQuestions(quizId);
//                 setQuestions(response.data);
//             } catch (error) {
//                 console.error("Error fetching questions:", error);
//                 setError("Failed to load questions.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchQuestions();
//     }, [quizId]);

//     if (loading) return <p>Loading questions...</p>;
//     if (error) return <p>{error}</p>;

//     return (
//         <div>
//             <h1>Quiz Questions</h1>
//             {questions.length > 0 ? (
//                 questions.map((question) => (
//                     <div key={question.id}>
//                         <p>{question.question}</p>
//                         {/* Render options */}
//                     </div>
//                 ))
//             ) : (
//                 <p>No questions available.</p>
//             )}
//         </div>
//     );
// };

// export default Quiz;

