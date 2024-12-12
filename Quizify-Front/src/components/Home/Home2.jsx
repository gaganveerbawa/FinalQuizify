import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "../../QuizCard";
import image from './image.png';
import image2 from './image2.png';
import image3 from './image3.png';

import { getQuiz } from "../../api/quiz"; // Adjust path as necessary

export default function Home2() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch quizzes from backend when component mounts
    const fetchQuizzes = async () => {
      try {
        const fetchedQuizzes = await getQuiz();
        setQuizzes(fetchedQuizzes);
      } catch (e) {
        console.error("Failed to fetch quizzes:", e);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`); // Navigate to quiz start page with quiz ID
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to QUIZIFY</h1>



<div id="controls-carousel" className="relative w-full" data-carousel="static">
    {/* <!-- Carousel wrapper --> */}
    {/* <div className="relative h-56 overflow-hidden rounded-lg md:h-96"> */}
    <div className="relative h-80 md:h-[700px] overflow-hidden rounded-lg">
         {/* <!-- Item 1 --> */}
        <div className="ease-in-out" data-carousel-item="active">
            <img src ={image} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        {/* <!-- Item 2 --> */}
        <div className="ease-in-out" data-carousel-item="active">
            <img src={image2} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        {/* <!-- Item 3 --> */}
        <div className="ease-in-out" data-carousel-item>
            <img src={image3} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
    </div>
    {/* <!-- Slider controls --> */}
    <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span className="sr-only">Previous</span>
        </span>
    </button>
    <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span className="sr-only">Next</span>
        </span>
    </button>
</div>

      
    </div>
  );
}
