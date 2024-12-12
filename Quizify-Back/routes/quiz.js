import express from "express";
import Quiz from "../Schema/quiz.schema.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { title, type, userId } = req.body;
  try {
    // console.log(newQuiz);
    const user = req.user;
    const newQuiz = new Quiz({ title, type, userId: user._id });
    newQuiz.userId = user._id;
    console.log("userId", newQuiz.userId);

    await newQuiz.save();
    res.status(201).json(newQuiz); // Use 201 for resource creation
  } catch (e) {
    console.error("Error creating quiz:", e); // Log error details
    res.status(400).json({ message: "Error creating quiz", e });
  }
});

router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).send(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Error fetching quiz", error });
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const { id } = req.query;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Compare the quiz creator's userId with the id from the request
    if (quiz.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this quiz" });
    }

    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json("Quiz deleted");
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Error deleting quiz", error });
  }
});


router.patch("/increment-impressions/:id", async (req, res) => {
  const { id } = req.params;
  console.log("quiz.js", id);

  try {
    const quiz = await Quiz.findById(id);
    console.log("quiz.js", quiz);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.impressions = (quiz.impressions || 0) + 1;
    console.log("quiz", quiz);

    await quiz.save();

    res.status(200).json({ message: "Impressions incremented" });
  } catch (error) {
    console.error("Error incrementing impressions:", error);
    res.status(500).json({ message: "Error incrementing impressions", error });
  }
});


export default router;
