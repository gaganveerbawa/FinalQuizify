import express from "express";
import PollQuestion from "../Schema/poll.schema.js";

const router = express.Router();

router.post("/:quizId/createPoll", async (req, res) => {
  const quizId = req.params.quizId;
  console.log("quizId", req.params.quizId);
  console.log(" i am in poll");

  const { question, optionType, options } = req.body;
  console.log(question, optionType, options);

  if (!question || !optionType || !options) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newPollQuestion = new PollQuestion({
      quizId,
      question,
      optionType,
      options,
    });
    await newPollQuestion.save();
    res.status(201).json(newPollQuestion);
  } catch (error) {
    console.error("Error creating poll question:", error);
    res.status(500).json({ message: "Error creating poll question", error });
  }
});

router.get("/:quizId/poll-questions", async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const pollQuestion = await PollQuestion.find({ quizId });
    const transformedPollQuestions = pollQuestion.map((q) => ({
      id: q._id,
      question: q.question,
      optionType: q.optionType,
      options: q.options,
    }));

    res.status(200).json(transformedPollQuestions);
  } catch (error) {
    console.error("Error fetching poll questions:", error);
    res.status(500).json({ message: "Error fetching poll questions", error });
  }
});

router.patch("/:questionId/options/:optionId", async (req, res) => {
  const { questionId, optionId } = req.params;

  try {
    // Find the poll question by ID
    const pollQuestion = await PollQuestion.findById(questionId);
    if (!pollQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Find the option by ID and increment the votes
    const option = pollQuestion.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: "Option not found" });
    }

    // Increment the votes
    option.votes += 1;

    // Save the updated poll question
    await pollQuestion.save();

    res.status(200).json(option);
  } catch (error) {
    console.error("Error updating option votes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:quizId/updatePollQuestions", async (req, res) => {
  const quizId = req.params.quizId;
  const { pollQuestions } = req.body;

  try {
    // Fetch all poll questions associated with the quiz
    const existingPollQuestions = await PollQuestion.find({ quizId });
    console.log("Existing poll questions:", existingPollQuestions);

    // Track updated poll questions
    const updatedPollQuestions = [];

    // Iterate over the provided poll questions and update them
    for (const updatedPollQuestion of pollQuestions) {
      const { question, options } = updatedPollQuestion;

      // Find the corresponding poll question from the existing poll questions by matching the content
      const pollQuestionToUpdate = existingPollQuestions.find(
        (q) => q.question === question
      );

      if (!pollQuestionToUpdate) {
        return res.status(404).json({ message: `Poll question not found` });
      }

      // Log the correct _id for debugging
      console.log("Update details with _id:", {
        _id: pollQuestionToUpdate._id,
        question,
        options,
      });

      // Update only the allowed fields
      pollQuestionToUpdate.question = question || pollQuestionToUpdate.question;
      pollQuestionToUpdate.options = options || pollQuestionToUpdate.options;

      // Save the updated poll question
      const updatedPollQuestionDoc = await PollQuestion.findByIdAndUpdate(
        pollQuestionToUpdate._id,
        pollQuestionToUpdate,
        {
          runValidators: true,
          new: true,
        }
      );

      updatedPollQuestions.push(updatedPollQuestionDoc);
    }

    res.status(200).json({
      message: "Poll questions updated successfully",
      updatedPollQuestions,
    });
  } catch (error) {
    console.error("Error updating poll questions:", error);
    res.status(500).json({ message: "Error updating poll questions", error });
  }
});

export default router;
