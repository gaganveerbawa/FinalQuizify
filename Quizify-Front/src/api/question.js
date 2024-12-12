import axios from "axios";
import { BACKEND_URL } from "../utils/constant";
import qs from "qs";

export const createQuestions = ({
  quizId,
  question,
  optionType,
  options,
  correctOption,
  timer,
}) => {
  console.log(
    "body",
    quizId,
    question,
    optionType,
    options,
    correctOption,
    timer
  );

  try {
    const response = axios.post(
      `${BACKEND_URL}/api/quiz/questions/${quizId}/createQuestion`,
      qs.stringify({
        question,
        optionType,
        options,
        correctOption,
        timer,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const getQuestions = (quizId) => {
  try {
    const response = axios.get(
      `${BACKEND_URL}/api/quiz/questions/${quizId}/questions`
    );
    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const evaluationCount = (id, isCorrect) => {
  try {
    console.log("evaluationCOunt", id, isCorrect);

    const response = axios.post(
      `${BACKEND_URL}/api/quiz/questions/update-count/${id}`,
      { isCorrect }
    );
    console.log(
      `Count updated for question ${id}: ${isCorrect ? "Correct" : "Incorrect"}`
    );
    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};


export const updatedQuestion = ({ quizId, questions }) => {
  console.log("questions", questions);

  try {
    const response = axios.post(
      `${BACKEND_URL}/api/quiz/questions/${quizId}/updateQuestions`,
      { questions },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { id: quizId },
      }
    );
    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};
