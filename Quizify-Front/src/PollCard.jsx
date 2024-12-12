import React from "react";

export default function PollCard({ title, date, impressions, onStart }) {
  return (
    <div className="p-4">
      <div className="block rounded-lg bg-gray-900 text-center text-gray-200 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="border-b-2 border-gray-700 px-6 py-3 dark:border-gray-700">
          Poll
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
            className="inline-block rounded bg-indigo-600 px-6 py-2 text-xs font-medium text-white uppercase shadow-md hover:bg-indigo-700"
          >
            Start Poll
          </button>
        </div>
      </div>
    </div>
  );
}
