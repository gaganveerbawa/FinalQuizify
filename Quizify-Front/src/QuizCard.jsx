import React from "react";

export default function QuizCard({ title, type, date, impressions, onStart }) {
  return (
    <div className="p-4">
      <div className="block rounded-lg bg-gray-900 text-center text-gray-200 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="border-b-2 border-gray-700 px-6 py-3 dark:border-gray-700">
          {type === "q&a" ? "Quiz" : "Poll"}
        </div>
        <div className="p-6">
          <h5 className="mb-2 text-xl font-semibold leading-tight text-gray-100 dark:text-white">
            {title}
          </h5>
          <p className="mb-4 text-base text-gray-300 dark:text-gray-400">
            Created on: {new Date(date).toLocaleDateString()}
          </p>
          <button
            type="button"
            onClick={onStart}
            className="inline-block rounded bg-indigo-600 px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-lg transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 active:bg-indigo-800 dark:shadow-none"
          >
            Start Quiz
          </button>
        </div>
        <div className="border-t-2 border-gray-700 px-6 py-3 text-gray-400 dark:text-gray-500">
           Impressions: {impressions}
        </div>
      </div>
    </div>
  );
}

