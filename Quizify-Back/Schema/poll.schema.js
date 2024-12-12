import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  optionType: {
    type: String,
    enum: ["text", "imageURL", "text&imageURL"],
    required: true,
  },
  options: [optionSchema],
});

const PollQuestion = mongoose.model("PollQuestion", pollSchema);

export default PollQuestion;
