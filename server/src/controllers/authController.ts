import { Request, Response } from "express";
import { HttpCode } from "@/utils/constants";
import User, { IUser } from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshTokenWithUser,
} from "@/utils/token";
import { clearAuthCookies } from "@/middleware/authMiddleware";

class AuthController {
  // User signup
  async signup(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "User already exists" });
        return;
      }

      const user = new User({ username, email, password });
      await user.save();

      res
        .status(HttpCode.CREATED)
        .json({ message: "User created successfully" });
    } catch (error) {
      console.error("Signup error:", error);
      res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }

  // User login
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const user: any = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "Invalid credentials" });
        return;
      }

      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 1000, // 2 minutes
      });

      res.cookie("userId", user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpCode.OK).json({
        message: "Login successful",
        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }

  // Refresh access token
  async refreshToken(req: Request, res: Response): Promise<void> {
    const userId = req.cookies.userId;
    console.log(userId, "user id in the refresh token ");

    const user: any = await User.findById(userId).select("+refreshToken");
    console.log(user, "user got in the refresh token ");

    try {
      const userWithRefresh = await validateRefreshTokenWithUser(
        user.refreshToken
      );
      console.log(userWithRefresh, "user with refresh");

      if (!userWithRefresh) {
        res
          .status(HttpCode.FORBIDDEN)
          .json({ message: "Invalid refresh token" });
        return;
      }

      const newAccessToken = generateAccessToken(user._id.toString());
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 1000,
        path: "/",
      });
      res.status(HttpCode.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(HttpCode.FORBIDDEN).json({ message: "Invalid refresh token" });
    }
  }

  // User logout
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById((req as any).user.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.clearCookie("userId", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(HttpCode.OK).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById((req as any).user.id).select(
        "-password -refreshToken"
      );

      if (!user) {
        res.status(HttpCode.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      res.status(HttpCode.OK).json({ user });
    } catch (error) {
      console.error("Get profile error:", error);
      res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }
}

export default AuthController;
