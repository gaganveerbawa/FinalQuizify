import axios from "axios";
import qs from "qs";
import { BACKEND_URL } from "../utils/constant";

export const createQuiz = async ({ title, type }) => {
  const data = qs.stringify({
    title,
    type,
  });
  // console.log("data sent:" + data);

  try {
    const response = await axios.post(`${BACKEND_URL}/api/quiz`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const getQuiz = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/quiz`);
    console.log(response);

    return response.data;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const getQuizByid = async (id) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/quiz/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/api/quiz/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: { id: quizId },
    });

    // Return the full response object
    return response;
  } catch (e) {
    // Return the response in case of an error
    if (e.response && e.response.status) {
      return e.response;
    }
    throw new Error(e.message); // Throw other types of errors
  }
};



// Method to increment quiz impressions
export const incrementQuizImpressions = async (quizId) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/quiz/increment-impressions/${quizId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error("Error details:", e.response ? e.response.data : e.message);
    throw new Error(e.response ? e.response.data.message : e.message);
  }
};


// export const getQuizByid = async() => {
//     try {
//       const response = await axios.get(`${BACKEND_URL}/api/quiz`);
//       return response.data;
//     } catch (error) {

//     }
// }
