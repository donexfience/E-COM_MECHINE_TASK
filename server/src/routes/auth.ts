import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpCode } from "@/utils/constants";
import User, { IUser } from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshTokenWithUser,
} from "@/utils/token";
import authMiddleware from "@/middleware/authMiddleware";

const router = express.Router();

// Signup
router.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(HttpCode.BAD_REQUEST).json({ message: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(HttpCode.CREATED).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
});

// Signin
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user: any = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      res.status(HttpCode.BAD_REQUEST).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshTokens = [refreshToken];
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
});

// Refresh Token
router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res
      .status(HttpCode.UNAUTHORIZED)
      .json({ message: "Refresh token required" });
  }

  try {
    const user = await validateRefreshTokenWithUser(refreshToken);

    if (!user) {
      res.status(HttpCode.FORBIDDEN).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(HttpCode.FORBIDDEN).json({ message: "Invalid refresh token" });
  }
});

// Logout
router.post("/logout", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (user) {
      // Clear the single refresh token
      user.refreshToken = undefined;
      await user.save();
    }

    // Clear the access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
});

export default router;
