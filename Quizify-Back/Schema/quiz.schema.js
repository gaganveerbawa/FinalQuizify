import mongoose from "mongoose";

const quizSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["q&a", "poll"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  impressions: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Quiz", quizSchema);
