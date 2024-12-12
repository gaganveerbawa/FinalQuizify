import React, { useState } from "react";
import { createQuiz } from "./api/quiz";
import { createQuestions, updatedQuestion } from "./api/question";

const CreateQuiz = () => {
  const [quiz, setQuiz] = useState({ title: "", type: "" });
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    optionType: "text",  // Default to "text"
    options: [{ text: "", imageURL: "" }, { text: "", imageURL: "" }, { text: "", imageURL: "" }, { text: "", imageURL: "" }],
    correctOption: "",  // This should be text or imageURL
    timer: "off",  // Default to "off"
  });

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleCreateQuiz = async () => {
    try {
      const response = await createQuiz(quiz);
      setQuizId(response.data._id);
      alert("Quiz created successfully!");
    } catch (error) {
      console.error("Error creating quiz:", error.message);
      alert("Failed to create quiz.");
    }
  };

  const handleAddQuestion = async () => {
    if (!quizId) {
      alert("Quiz ID is missing. Please create the quiz first.");
      return;
    }

    try {
      // Ensure options are structured properly based on the optionType
      const payload = {
        quizId,
        question: newQuestion.question,
        optionType: newQuestion.optionType,
        options: newQuestion.options.map(option => ({
          text: option.text || "",  // Ensure text is set even if it's empty
          imageURL: option.imageURL || "",  // Ensure imageURL is set even if it's empty
        })),
        correctOption: newQuestion.correctOption,  // Ensure correctOption is valid (text or imageURL)
        timer: newQuestion.timer,  // Send the timer value (off, 5sec, or 10sec)
      };

      console.log("Payload being sent to API:", payload); // Log payload to debug

      const response = await createQuestions(payload);
      setQuestions((prev) => [...prev, response.data]);
      alert("Question added successfully!");
    } catch (error) {
      console.error("Error adding question:", error.message);
      alert("Failed to add question.");
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      await updatedQuestion({ quizId, questions });
      alert("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error.message);
      alert("Failed to submit quiz.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create a New Quiz</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Quiz Details</h2>
        <input
          type="text"
          name="title"
          placeholder="Quiz Title"
          value={quiz.title}
          onChange={handleQuizChange}
          className="border p-2 w-full rounded mb-2"
        />

        <div className="quiz-type mt-5">
          <label className="mr-4">
            <input
              type="radio"
              name="type"
              value="q&a"
              checked={quiz.type === "q&a"}
              onChange={handleQuizChange}
            />
            Q&A
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="poll"
              checked={quiz.type === "poll"}
              onChange={handleQuizChange}
            />
            Poll
          </label>
        </div>

        <button
          onClick={handleCreateQuiz}
          disabled={!quiz.title || !quiz.type}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Create Quiz
        </button>
      </div>

      {quizId && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Add Questions</h2>
          <input
            type="text"
            name="question"
            placeholder="Question Text"
            value={newQuestion.question}
            onChange={handleQuestionChange}
            className="border p-2 w-full rounded mb-2"
          />
          {newQuestion.options.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder={`Option ${index + 1} Text`}
                value={option.text}
                onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                className="border p-2 w-full rounded mb-2"
              />
              <input
                type="text"
                placeholder={`Option ${index + 1} Image URL`}
                value={option.imageURL}
                onChange={(e) => handleOptionChange(index, "imageURL", e.target.value)}
                className="border p-2 w-full rounded mb-2"
              />
            </div>
          ))}
          <input
            type="number"
            name="correctOption"
            placeholder="Correct Option (Index)"
            value={newQuestion.correctOption}
            onChange={handleQuestionChange}
            className="border p-2 w-full rounded mb-2"
          />
          <div className="mt-4">
            <label className="mr-4">
              <input
                type="radio"
                name="timer"
                value="off"
                checked={newQuestion.timer === "off"}
                onChange={handleQuestionChange}
              />
              Off
            </label>
            <label className="mr-4">
              <input
                type="radio"
                name="timer"
                value="5sec"
                checked={newQuestion.timer === "5sec"}
                onChange={handleQuestionChange}
              />
              5 seconds
            </label>
            <label>
              <input
                type="radio"
                name="timer"
                value="10sec"
                checked={newQuestion.timer === "10sec"}
                onChange={handleQuestionChange}
              />
              10 seconds
            </label>
          </div>

          <button
            onClick={handleAddQuestion}
            disabled={!newQuestion.question || newQuestion.options.some(opt => !opt.text && !opt.imageURL)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Add Question
          </button>
        </div>
      )}

      {quizId && questions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Submit Quiz</h2>
          <button
            onClick={handleSubmitQuiz}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
