import { Request, Response } from "express";
import { HttpCode } from "@/utils/constants";
import User, { IUser } from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshTokenWithUser,
} from "@/utils/token";

class AuthController {
  // User signup
  async signup(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(HttpCode.BAD_REQUEST).json({ message: "User already exists" });
        return;
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
  }

  // User login
  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      const user: any = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
        res.status(HttpCode.BAD_REQUEST).json({ message: "Invalid credentials" });
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
          email: user.email
        }
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
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res
        .status(HttpCode.UNAUTHORIZED)
        .json({ message: "Refresh token required" });
      return;
    }

    try {
      const user = await validateRefreshTokenWithUser(refreshToken);

      if (!user) {
        res.status(HttpCode.FORBIDDEN).json({ message: "Invalid refresh token" });
        return;
      }

      const newAccessToken = generateAccessToken(user._id.toString());
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
      const user = await User.findById((req as any).user.id).select('-password -refreshToken');
      
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