import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { deleteQuiz, getQuiz } from "../../../api/quiz";
import toast from "react-hot-toast";
import "./Analytics.css";
import DeleteModal from "../CreateQuiz/DeleteModal/DeleteModal";
import QuizModal from "../CreateQuiz/QuizModal/QuizModal";
import QuizQuestions from "../CreateQuiz/QuizQuestions/QuizQuestions";
import PollQuestions from "../CreateQuiz/PollQuestions/PollQuestions";

const Analytics = () => {
  const { quizId } = useParams(); // Extract quizId from the URL
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(quizId || null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(!!quizId); // Open modal if quizId exists in URL
  const [selectedQuizType, setSelectedQuizType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuiz();
        setQuizzes(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (quizId) {
      const selectedQuiz = quizzes.find((quiz) => quiz._id === quizId);
      if (selectedQuiz) {
        setSelectedQuizId(selectedQuiz._id);
        setSelectedQuizType(selectedQuiz.type);
        setIsQuizModalOpen(true);
      }
    }
  }, [quizId, quizzes]);


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

  const openModal = (id) => {
    setSelectedQuizId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedQuizId(null);
  };

  const handleUpdate = (quizId, quizType) => {
    setSelectedQuizId(quizId);
    setSelectedQuizType(quizType);
    setIsQuizModalOpen(true);

    // Update the URL to include the quizId without navigating away from Analytics
    navigate(`${location.pathname}?quizId=${quizId}&action=update`, { replace: true });
  };

  const closeQuizModal = () => {
    setIsQuizModalOpen(false);
    setSelectedQuizId(null);
    setSelectedQuizType("");
    navigate(`/dashboard/analytics`, { replace: true }); // Reset the URL when closing the modal
  };

  const handleDelete = async () => {
    try {
      const response = await deleteQuiz(selectedQuizId);
      if (response.status === 200) {
        toast.success("Quiz deleted successfully");
        setQuizzes(quizzes.filter((q) => q._id !== selectedQuizId));
      } else if (response.status === 403) {
        toast.error("Not authorized to delete this quiz");
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (e) {
      console.error("Error deleting quiz:", e);
      toast.error("Failed to delete quiz");
    } finally {
      closeModal();
    }
  };

  const handleShare = (quizId, quizType) => {
    const baseUrl = window.location.origin;
    let shareUrl;

    if (quizType === "poll") {
      shareUrl = `${baseUrl}/quiz/${quizId}/questions/poll`;
    } else {
      shareUrl = `${baseUrl}/quiz/${quizId}/questions/view`;
    }

    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast.success("Text copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy text");
      }
    );
  };

  const handleAnalysis = (selectedQuizId, quizType) => {
    if (quizType === "poll") {
      navigate(`/dashboard/analytics/poll/${selectedQuizId}`);
    } else {
      navigate(`/dashboard/analytics/quiz/${selectedQuizId}`);
    }
  };

  return (
    <div className="table-container">
      <h1 className="analytics-title">Quiz Analysis</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : (
            quizzes.map((quiz, index) => (
              <tr
                key={quiz._id}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{formatDate(quiz.date)}</td>
                <td>{quiz.impressions}</td>
                <td>
                  <span
                    className="icon edit"
                    title="Edit"
                    onClick={() => handleUpdate(quiz._id, quiz.type)}
                  ></span>
                  <span
                    className="icon delete"
                    onClick={() => openModal(quiz._id)}
                    title="Delete"
                  ></span>
                  <span
                    className="icon share"
                    onClick={() => handleShare(quiz._id, quiz.type)}
                    title="Share"
                  ></span>
                  <a
                    className="analysis-link"
                    onClick={() => handleAnalysis(quiz._id, quiz.type)}
                  >
                    Question Wise Analysis
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalOpen && (
        <DeleteModal
          isOpen={modalOpen}
          onClose={closeModal}
          onDelete={handleDelete}
        />
      )}

      {isQuizModalOpen && (
        <QuizModal isOpen={isQuizModalOpen} onClose={closeQuizModal}>
          {selectedQuizType === "q&a" ? (
            <QuizQuestions quizId={selectedQuizId} />
          ) : (
            <PollQuestions quizId={selectedQuizId} />
          )}
        </QuizModal>
      )}
    </div>
  );
};

export default Analytics;
