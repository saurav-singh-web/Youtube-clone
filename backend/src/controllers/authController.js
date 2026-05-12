import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { validateLoginInput, validateRegisterInput } from "../utils/validators.js";

export const registerUser = async (req, res) => {
  const validationError = validateRegisterInput(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "Registration successful. Please log in.",
    user: {
      userId: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

export const loginUser = async (req, res) => {
  const validationError = validateLoginInput(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.status(200).json({
    message: "Login successful.",
    token: generateToken(user._id),
    user: {
      userId: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

export const getProfile = async (req, res) => {
  return res.status(200).json({
    user: {
      userId: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      channels: req.user.channels,
    },
  });
};

