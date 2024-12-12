import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  imageURL: {
    type: String,
  },
});

const questionSchema = new mongoose.Schema({
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
  options: [optionSchema], // An array of options containing both text and imageURL
  correctOption: {
    type: String, // Stores either the text, imageURL, or both depending on the optionType
    required: true,
  },
  timer: {
    type: String,
    enum: ["off", "5sec", "10sec"],
    default: "off",
  },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
