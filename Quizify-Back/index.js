import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fs from "fs";
import authRoute from "./routes/auth.js";
import quizRoute from "./routes/quiz.js";
import questionRoute from "./routes/question.js";
import pollRoute from "./routes/pollQuestion.js";

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Logging the requests
app.use((req, res, next) => {
  const reqString = `${req.method} ${req.url} ${Date.now()}\n`;
  fs.writeFile("log.txt", reqString, { flag: "a" }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  next();
});

//Routes
app.use("/auth", authRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/quiz/questions", questionRoute);
app.use("/api/quiz/pollQuestion", pollRoute);

app.use((req, res, next, err) => {
  const reqString = `${req.method} ${req.url} ${Date.now()} ${err.message}\n`;
  fs.writeFile("error.txt", reqString, { flag: "a" }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  req.status(500).send("Internal Server Error");
  next();
});

//Connecting to MongoDB;
mongoose
  .connect(process.env.MONGOOSE_URL, {})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT} `);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
