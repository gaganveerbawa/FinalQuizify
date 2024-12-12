import axios from "axios";
import { BACKEND_URL } from "../utils/constant";
import qs from "qs";

export const createPollQuestions = ({
  quizId,
  question,
  optionType,
  options,
}) => {
  try {
    const response = axios.post(
      `${BACKEND_URL}/api/quiz/pollQuestion/${quizId}/createPoll`,
      qs.stringify({
        question,
        optionType,
        options,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating poll question:", error);
    throw error;
  }
};

export const getPollQuestions = (quizId) => {
  try {
    const response = axios.get(
      `${BACKEND_URL}/api/quiz/pollQuestion/${quizId}/poll-questions`
    );
    return response;
  } catch (error) {
    console.error("Error getting poll questions:", error);
    throw error;
  }
};

export const updatedPollQuestion = ({ quizId, questions }) => {
  console.log("questions", questions);

  try {
    const response = axios.post(
      `${BACKEND_URL}/api/quiz/pollQuestion/${quizId}/updatePollQuestions`,
      { questions },
      {
        headers: {
          "Content-Type": "application/json",
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
