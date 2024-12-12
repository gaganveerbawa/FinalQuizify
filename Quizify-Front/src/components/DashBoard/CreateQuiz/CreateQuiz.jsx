/* eslint-disable no-unused-vars */
import { useState } from "react";
import { createQuiz } from "../../../api/quiz";
import { useNavigate } from "react-router-dom";
import QuizQuestion from "./QuizQuestions/QuizQuestions";
import PollQuestions from "./PollQuestions/PollQuestions";
import toast from "react-hot-toast";

function CreateQuiz() {
  const [quizName, setQuizName] = useState("");
  const [type, setType] = useState("q&a");
  const navigate = useNavigate();

  const handleInput = (e) => {
    setQuizName(e.target.value);
  };

  const handleType = (newType) => {
    setType(newType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!quizName) {
      toast.error("Please enter a quiz name");
      return;
    }

    try {
      const response = await createQuiz({ title: quizName, type });

      if (response.status === 201) {
        toast.success("Quiz created");
        setQuizName("");
        // navigate(`/dashboard/quiz/${response.data._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating quiz");
    }

    // Clear the form inputs
    setQuizName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Create a New Quiz</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quizName">
              Quiz Name
            </label>
            <input
              type="text"
              id="quizName"
              placeholder="Enter quiz name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={quizName}
              onChange={handleInput}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quiz Type
            </label>
            <div className="flex justify-around">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-white font-bold ${
                  type === "q&a" ? "bg-blue-600" : "bg-gray-400"
                }`}
                onClick={() => handleType("q&a")}
              >
                Q & A
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-white font-bold ${
                  type === "poll" ? "bg-blue-600" : "bg-gray-400"
                }`}
                onClick={() => handleType("poll")}
              >
                Poll Type
              </button>
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              disabled={!quizName}
            >
              Continue
            </button>
          </div>
        </form>
        <div className="mt-6">
          {type === "q&a" ? <QuizQuestion /> : <PollQuestions />}
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;


// /* eslint-disable no-unused-vars */
// import { useState } from "react";
// import "./CreateQuiz.css";
// import toast from "react-hot-toast";
// import { createQuiz } from "../../../api/quiz";
// import { useNavigate } from "react-router-dom";
// import QuizQuestion from "./QuizQuestions/QuizQuestions";
// import PollQuestions from "./PollQuestions/PollQuestions";
// import QuizModal from "./QuizModal/QuizModal";

// function CreateQuiz() {
//   const [quizName, setQuizName] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [type, setType] = useState("q&a");
//   const navigate = useNavigate();
//   const handleInput = (e) => {
//     setQuizName(e.target.value);
//   };

//   const handleType = (newType) => {
//     setType(newType);
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     navigate("/dashboard");
//     setIsModalOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior

//     if (!quizName) {
//       toast.error("Please enter a quiz name");
//       return;
//     }

//     try {
//       const response = await createQuiz({ title: quizName, type });

//       if (response.status === 201) {
//         toast.success("Quiz created");
//         setQuizName("");
//         navigate(`/dashboard/quiz/${response.data._id}`);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error creating quiz");
//     }

//     // Clear the form inputs
//     setQuizName("");
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <div className="quiz-modal">
//           <input
//             type="text"
//             placeholder="Quiz name"
//             className="quiz-input"
//             value={quizName}
//             onChange={handleInput}
//           />
//         </div>
//         <div className="quiz-type">
//           <label>Quiz type</label>
//           <button
//             type="button"
//             className={`qna-btn ${type === "q&a" ? "active" : ""}`}
//             onClick={() => handleType("q&a")}
//           >
//             Q & A
//           </button>
//           <button
//             type="button"
//             className={`poll-btn ${type === "poll" ? "active" : ""}`}
//             onClick={() => handleType("poll")}
//           >
//             Poll Type
//           </button>
//         </div>
//         <button
//           type="submit"
//           className="quiz-continue"
//           onClick={openModal}
//           disabled={!quizName} // Disable the button if quizName is empty
//         >
//           Continue
//         </button>
//       </form>
//       <QuizModal isOpen={isModalOpen} onClose={closeModal}>
//         {type === "q&a" ? <QuizQuestion /> : <PollQuestions />}
//       </QuizModal>
//     </>
//   );
// }

// export default CreateQuiz;
