import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createPollQuestions,
  getPollQuestions,
  updatedPollQuestion,
} from "../../../../api/pollQuestion";
import toast from "react-hot-toast";
import { getQuestions, updatedQuestion } from "../../../../api/question";

function PollQuestions() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: [
        { text: "", imageURL: "", votes: 0 },
        { text: "", imageURL: "", votes: 0 },
      ],
      optionType: "text", // Adding this to manage the option type
    },
  ]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getPollQuestions(quizId);

        if (response.data && response.data.length > 0) {
          // Assuming response.data is the array of questions
          setQuestions(response.data);
          setCurrentQuestionIndex(0); // Start from the first question
        } else {
          console.error("No questions found for this quiz");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: [
          { text: "", imageURL: "", votes: 0 },
          { text: "", imageURL: "", votes: 0 },
        ],
        optionType: "text", // Defaulting to text
      },
    ]);
    setCurrentQuestionIndex(questions.length);
  };
  const updateQuestions = async () => {
    try {
      // Ensure that each question object has a valid _id
      const validQuestions = questions.map(({ _id, question, options }) => ({
        _id, // Ensure _id is set correctly
        question, // Only send fields that need updating
        options,
      }));
      console.log("valid Questions", validQuestions);

      const response = await updatedPollQuestion({
        quizId,
        questions: validQuestions,
      });

      if (response.status === 200) {
        toast.success("Questions updated successfully");
      } else {
        throw new Error("Failed to update questions");
      }
    } catch (error) {
      toast.error("Failed to update questions");
      console.error("Update error:", error);
    }
  };

  const handleOptionTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].optionType = value;
    updatedQuestions[index].options = [
      { text: "", imageURL: "", votes: 0 },
      { text: "", imageURL: "", votes: 0 },
    ];
    setQuestions(updatedQuestions);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      imageURL: "",
      votes: 0,
    });
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    }
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const params = useParams();
  const action = queryParams.get("action");
  // Extract the quizId from the path
  var quizId;

  // Determine if it's create mode or update mode
  if (location.search) {
    // Update mode: quizId comes from the query string
    quizId = queryParams.get("quizId");
  } else {
    // Create mode: quizId comes from the URL path
    const fullPath = params["*"];
    quizId = fullPath.split("/").pop();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (action === "update") {
      console.log("update...");
      await updateQuestions();
    } else {
      try {
        for (const question of questions) {
          const response = await createPollQuestions({
            quizId,
            question: question.question,
            optionType: question.optionType,
            options: question.options,
          });

          if (response.status !== 201) {
            throw new Error(`Failed to add question: ${question.question}`);
          }
        }
        toast.success("Questions added successfully");
        navigate(`/quiz/${quizId}/questions/poll`);
      } catch (error) {
        toast.error("Failed to add questions");
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        {questions.map((q, index) => (
          <div key={index} style={{ position: "relative" }}>
            <button
              onClick={() => setCurrentQuestionIndex(index)}
              className="question-index"
            >
              {index + 1}
            </button>
            <button
              onClick={() => deleteQuestion(index)}
              className="delete-btn"
              style={{
                display: index === currentQuestionIndex ? "block" : "none",
              }}
            >
              X
            </button>
          </div>
        ))}
        {questions.length < 5 && (
          <button onClick={addQuestion} className="add-question">
            +
          </button>
        )}
        <label className="max-question">Max 5 questions</label>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map(
          (question, questionIndex) =>
            questionIndex === currentQuestionIndex && (
              <div key={question.id} className="question-container">
                <input
                  className="input-question"
                  type="text"
                  placeholder="Enter your poll question"
                  value={question.question}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].question = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                />
                <br />

                <label className="option-type sta">Option type:</label>
                <input
                  className="option-radio"
                  type="radio"
                  name={`optionType-${questionIndex}`}
                  value="text"
                  id={`text-${questionIndex}`}
                  checked={question.optionType === "text"}
                  onChange={(e) =>
                    handleOptionTypeChange(questionIndex, e.target.value)
                  }
                />
                <label
                  htmlFor={`text-${questionIndex}`}
                  className="text-option"
                >
                  Text
                </label>

                <input
                  className="option-radio"
                  type="radio"
                  name={`optionType-${questionIndex}`}
                  value="imageURL"
                  id={`image-${questionIndex}`}
                  checked={question.optionType === "imageURL"}
                  onChange={(e) =>
                    handleOptionTypeChange(questionIndex, e.target.value)
                  }
                />
                <label
                  htmlFor={`image-${questionIndex}`}
                  className="text-option"
                >
                  Image URL
                </label>

                <input
                  className="option-radio"
                  type="radio"
                  name={`optionType-${questionIndex}`}
                  value="text&imageURL"
                  id={`text&imageURL-${questionIndex}`}
                  checked={question.optionType === "text&imageURL"}
                  onChange={(e) =>
                    handleOptionTypeChange(questionIndex, e.target.value)
                  }
                />
                <label
                  htmlFor={`text&imageURL-${questionIndex}`}
                  className="text-option"
                >
                  Text & Image URL
                </label>
                <br />

                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    {question.optionType === "text" && (
                      <div>
                        <input
                          className="option-input"
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option.text}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[
                              optionIndex
                            ].text = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        {optionIndex >= 2 && (
                          <button
                            type="button"
                            className="deleteBtn"
                            onClick={() =>
                              deleteOption(questionIndex, optionIndex)
                            }
                          >
                            <img
                              src="/images/delete.png"
                              alt="deleteImg"
                              className="deleteImg"
                            />
                          </button>
                        )}
                      </div>
                    )}
                    {question.optionType === "imageURL" && (
                      <div>
                        <input
                          className="option-input"
                          type="text"
                          placeholder="Image URL"
                          value={option.imageURL}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[
                              optionIndex
                            ].imageURL = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        {optionIndex >= 2 && (
                          <button
                            type="button"
                            className="deleteBtn"
                            onClick={() =>
                              deleteOption(questionIndex, optionIndex)
                            }
                          >
                            <img
                              src="/images/delete.png"
                              alt="deleteImg"
                              className="deleteImg"
                            />
                          </button>
                        )}
                      </div>
                    )}
                    {question.optionType === "text&imageURL" && (
                      <div>
                        <input
                          className="option-input txt1"
                          type="text"
                          placeholder="Option Text"
                          value={option.text}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[
                              optionIndex
                            ].text = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        <input
                          className="option-input txt2"
                          type="text"
                          placeholder="Image URL"
                          value={option.imageURL}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[
                              optionIndex
                            ].imageURL = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        {optionIndex >= 2 && (
                          <button
                            type="button"
                            className="deleteBtn"
                            onClick={() =>
                              deleteOption(questionIndex, optionIndex)
                            }
                          >
                            <img
                              src="/images/delete.png"
                              alt="deleteImg"
                              className="deleteImg"
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {question.options.length < 4 && (
                  <button
                    type="button"
                    className="add-option"
                    onClick={() => addOption(questionIndex)}
                  >
                    Add Option
                  </button>
                )}
                <br />

                <button className="submit-btn" type="submit">
                  {action === "update" ? "update Quiz" : "Create Quiz"}
                </button>
              </div>
            )
        )}
      </form>
    </>
  );
}

export default PollQuestions;
