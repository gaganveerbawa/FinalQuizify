import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PollCard from "./PollCard"; // Component for individual poll cards
import { getPollQuestions } from "./api/pollQuestion"; // Adjust path as necessary

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch polls from the backend when the component mounts
    const fetchPolls = async () => {
      try {
        const fetchedPolls = await getPollQuestions();
        setPolls(fetchedPolls);
      } catch (e) {
        console.error("Failed to fetch polls:", e);
      }
    };

    fetchPolls();
  }, []);

  const handleStartPoll = (pollId) => {
    navigate(`/poll/${pollId}`); // Navigate to poll start page with poll ID
  };

  return (
    <div className="p-6">
      {/* Responsive grid layout for PollCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.length > 0 ? (
          polls.map((poll) => (
            <PollCard
              key={poll._id}
              title={poll.title}
              date={poll.date}
              impressions={poll.impressions}
              onStart={() => handleStartPoll(poll._id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No polls available</p>
        )}
      </div>
    </div>
  );
}
