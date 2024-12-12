import express from "express";
import User from "../Schema/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const saltRounds = 10;

router.get("/", (req, res) => {
  res.send("Welcome to authentication");
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    console.log(name, email, password);

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);
    res.json({
      email,
      token: token,
    });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");
    const validatePassword = bcrypt.compareSync(password, user.password);
    if (!validatePassword) {
      return res.status(400).send("Wrong Password");
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);
    res.status(200).json({
      email,
      token: token,
    });
  } catch (e) {
    return new Error(e.message);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      // alert("authorization is missing");
      return res.status(401).send("Authorization is missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      // alert("Token missing");
      return res.status(401).send("Token is missing");
    }

    const validToken = jwt.verify(token, process.env.SECRET_TOKEN);

    const userId = validToken.id;

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(400).send("User not found");
    res.status(200).json({
      email: userExists.email,
      name: userExists.name,
    });
  } catch (error) {
    next(error);
  }
});


export default router;