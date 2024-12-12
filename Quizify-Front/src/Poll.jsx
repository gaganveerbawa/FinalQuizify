import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPollQuestions } from "./api/poll"; 
import { incrementPollImpressions } from "./api/poll"; // Import the new method

const Poll = () => {
  const { pollId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPollQuestions = async () => {
      try {
        const response = await getPollQuestions(pollId);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching poll questions:", error);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPollQuestions();
  }, [pollId]);

  // Handle answer selection
  const handleSelectAnswer = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  // Handle poll submission
  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Optionally, handle score calculation or result processing for polls here.

    setSubmitted(true);

    // Increment poll impressions after submitting the poll
    try {
      await incrementPollImpressions(pollId);
      console.log("Impressions incremented successfully.");
    } catch (error) {
      console.error("Error incrementing impressions:", error);
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Poll Questions</h1>
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
            Submit Poll
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Poll Completed!</h2>
          <p>Thank you for participating!</p>
        </div>
      )}
    </div>
  );
};

export default Poll;
