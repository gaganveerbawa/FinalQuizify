import { useState, useEffect } from "react";
// import "./QuizQuestions.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  createQuestions,
  getQuestions,
  updatedQuestion,
} from "../../../../api/question";
import toast from "react-hot-toast";
import ShareModal from "../ShareModal/ShareModal"; // Import the ShareModal component

function QuizQuestions() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: [
        { text: "", imageURL: "" }, // Default option 1
        { text: "", imageURL: "" }, // Default option 2
      ],
      answer: "",
      timer: "off",
      optionType: "text",
    },
  ]);
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false); // State to manage ShareModal visibility

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

  // Fetch existing questions if any
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions(quizId);
        console.log("response", response.data);

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

  const updateQuestions = async () => {
    try {
      // Ensure that each question object has a valid _id
      const validQuestions = questions.map(
        ({ _id, question, options, timer }) => ({
          _id, // Ensure _id is set correctly
          question, // Only send fields that need updating
          options,
          timer,
        })
      );

      const response = await updatedQuestion({
        quizId,
        questions: validQuestions,
      });

      if (response.status === 200) {
        toast.success("Questions updated successfully");
      } else {
        // Handle unexpected status codes
        toast.error("Failed to update questions");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code other than 2xx
        if (error.response.status === 403) {
          toast.error("You are not authorized to perform this action.");
        } else {
          toast.error("Failed to update questions");
        }
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response received from the server.");
      } else {
        // Something else went wrong
        toast.error("An unexpected error occurred.");
      }
      console.error("Update error:", error);
    }
  };

  const handleOptionTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].optionType = value;
    // Reset options if the type changes to ensure compatibility
    updatedQuestions[index].options = [
      { text: "", imageURL: "" }, // Default option 1
      { text: "", imageURL: "" }, // Default option 2
    ];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({ text: "", imageURL: "" });
    setQuestions(updatedQuestions);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: [
          { text: "", imageURL: "" }, // Default option 1
          { text: "", imageURL: "" }, // Default option 2
        ],
        answer: "",
        timer: "off",
        optionType: "text",
      },
    ]);
    setCurrentQuestionIndex(questions.length);
  };

  const deleteQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update existing questions
      if (action === "update") {
        // console.log("updated...");

        await updateQuestions(); // Use the updateQuestions function
      } else {
        // Create new questions
        for (const question of questions) {
          const response = await createQuestions({
            quizId, // This will be undefined for new quizzes
            question: question.question,
            optionType: question.optionType,
            options: question.options,
            correctOption: question.answer,
            timer: question.timer,
          });

          if (response.status !== 201) {
            throw new Error(`Failed to add question: ${question.question}`);
          }

          toast.success("Questions added successfully");
        }
      }

      setShowShareModal(true); // Show the ShareModal after successful operation
    } catch (error) {
      toast.error("Failed to add or update questions");
      console.error("Submission error:", error);
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
            +{" "}
          </button>
        )}
        <label className="max-question">Max 5 questions</label>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((question, questionIndex) =>
          questionIndex === currentQuestionIndex ? (
            <div key={question.id} className="question-container">
              <input
                className="input-question"
                type="text"
                placeholder="Enter your question"
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
              <label htmlFor={`text-${questionIndex}`} className="text-option">
                Text
              </label>
              <input
                className="option-radio"
                type="radio"
                name={`optionType-${questionIndex}`}
                value="imageURL"
                id={`imageURL-${questionIndex}`}
                checked={question.optionType === "imageURL"}
                onChange={(e) =>
                  handleOptionTypeChange(questionIndex, e.target.value)
                }
              />
              <label
                htmlFor={`imageURL-${questionIndex}`}
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
                        className="options-radio"
                        type="radio"
                        name={`answer-${questionIndex}`}
                        value={option.text}
                        checked={question.answer === option.text}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].answer =
                            e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                      <input
                        className="option-input"
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            "text",
                            e.target.value
                          )
                        }
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
                        className="option-radio url"
                        type="radio"
                        name={`answer-${questionIndex}`}
                        value={option.imageURL}
                        checked={question.answer === option.imageURL}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].answer =
                            e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                      <input
                        className="option-input txt"
                        type="text"
                        placeholder={`Image URL ${optionIndex + 1}`}
                        value={option.imageURL}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            "imageURL",
                            e.target.value
                          )
                        }
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
                        className="option-radio rdo"
                        type="radio"
                        name={`answer-${questionIndex}`}
                        value={`${option.text} ${option.imageURL}`}
                        checked={
                          question.answer ===
                          `${option.text} ${option.imageURL}`
                        }
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].answer =
                            e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                      <input
                        className="option-input txt1"
                        type="text"
                        placeholder={`Option ${optionIndex + 1} Text`}
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            "text",
                            e.target.value
                          )
                        }
                      />
                      <input
                        className="option-input txt2"
                        type="text"
                        placeholder={`Option ${optionIndex + 1} Image URL`}
                        value={option.imageURL}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            "imageURL",
                            e.target.value
                          )
                        }
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
              <div className="timer-container">
                <label className="timer-label">Timer:</label>
                <button
                  type="button"
                  className={question.timer === "off" ? "active" : ""}
                  onClick={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].timer = "off";
                    setQuestions(updatedQuestions);
                  }}
                >
                  Off
                </button>
                <button
                  type="button"
                  className={question.timer === "5sec" ? "active" : ""}
                  onClick={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].timer = "5sec";
                    setQuestions(updatedQuestions);
                  }}
                >
                  5 sec
                </button>
                <button
                  type="button"
                  className={question.timer === "10sec" ? "active" : ""}
                  onClick={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].timer = "10sec";
                    setQuestions(updatedQuestions);
                  }}
                >
                  10 sec
                </button>
              </div>
              <br />
              <button className="submit-btn" type="submit">
                {action === "update" ? "update Quiz" : "Create Quiz"}
              </button>
            </div>
          ) : null
        )}
      </form>

      {/* Render ShareModal if showShareModal is true */}
      {/* Render ShareModal if showShareModal is true and action is not "update" */}
      {showShareModal && action !== "update" && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
}

export default QuizQuestions;
