import express from "express";
import Question from "../Schema/question.schema.js";
//66c46d780f724cf5dd9fccf9 for example
const router = express.Router();

router.post("/:quizId/createQuestion", async (req, res) => {
  const quizId = req.params.quizId;
  // console.log(quizId);
  const { question, optionType, options, correctOption, timer } = req.body;
  // console.log(question, optionType, options, correctOption, timer);

  if (!question || !optionType || !options || !correctOption || !timer) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newQuestion = new Question({
      quizId,
      question,
      optionType,
      options,
      correctOption,
      timer,
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(400).json({ message: "Error creating question", error });
  }
});

router.get("/:quizId/questions", async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const question = await Question.find({ quizId });
    const transformedQuestions = question.map((q) => ({
      id: q._id,
      question: q.question,
      options: q.options,
      optionType: q.optionType,
      correctOption: q.correctOption,
      timer: q.timer,
      correctCount: q.correctCount,
      incorrectCount: q.incorrectCount,
    }));
    // console.log(transformedQuestions);

    res.status(200).json(transformedQuestions);
  } catch (error) {
    console.error("Error retrieving questions:", error);
    res.status(500).json({ message: "Error retrieving questions", error });
  }
});

// router.get("/:quizId", async (req, res) => {
//   try {
//     const { quizId } = req.params.quizId;

//     // Check if quizId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(quizId)) {
//       return res.status(400).json({ message: "Invalid quizId" });
//     }

//     const questions = await Question.find({ quizId });
//     res.status(200).json(questions);
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.get("/count", async (req, res) => {
  try {
    const questionCount = await Question.countDocuments();
    res.status(200).json({ count: questionCount });
    // console.log("question-count", questionCount);
  } catch (error) {
    console.error("Error counting questions:", error);
    res
      .status(500)
      .json({ message: "Server Error: Unable to count questions" });
  }
});

router.post("/update-count/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { isCorrect } = req.body;
  // console.log("backend1", req.params);
  // console.log("backend2", req.body);

  try {
    const update = isCorrect
      ? { $inc: { correctCount: 1 } }
      : { $inc: { incorrectCount: 1 } };
    // console.log("update", update);

    await Question.findByIdAndUpdate(questionId, update, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({ message: "Updated question count" });
  } catch (error) {
    console.error("Error updating count:", error);
    res.status(500).json({ message: "Server Error: Unable to update count" });
  }
});

router.post("/:quizId/updateQuestions", async (req, res) => {
  const quizId = req.params.quizId;
  const { questions } = req.body;

  try {
    // Fetch all questions associated with the quiz
    const existingQuestions = await Question.find({ quizId });
    console.log("Existing questions:", existingQuestions);

    // Track updated questions
    const updatedQuestions = [];

    // Iterate over the provided questions and update them
    for (const updatedQuestion of questions) {
      const { question, options, timer } = updatedQuestion;

      // Find the corresponding question from the existing questions by matching the content
      const questionToUpdate = existingQuestions.find(
        (q) => q.question === question
      );

      if (!questionToUpdate) {
        return res.status(404).json({ message: `Question not found` });
      }

      // Log the correct _id for debugging
      console.log("Update details with _id:", {
        _id: questionToUpdate._id,
        question,
        options,
        timer,
      });

      // Update only the allowed fields
      questionToUpdate.question = question || questionToUpdate.question;
      questionToUpdate.options = options || questionToUpdate.options;
      questionToUpdate.timer = timer || questionToUpdate.timer;

      // Save the updated question
      const updatedQuestionDoc = await Question.findByIdAndUpdate(
        questionToUpdate._id,
        questionToUpdate,
        {
          runValidators: true,
          new: true,
        }
      );

      updatedQuestions.push(updatedQuestionDoc);
    }

    res
      .status(200)
      .json({ message: "Questions updated successfully", updatedQuestions });
  } catch (error) {
    console.error("Error updating questions:", error);
    res.status(500).json({ message: "Error updating questions", error });
  }
});

export default router;
