import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User do not exists",
      });
    }

    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (isMatched) {
      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: existingUser._id,
          fullName: existingUser.fullName,
          email: existingUser.email,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
export { getCurrentUser, loginUser, registerUser };
