import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpCode } from "@/utils/constants";
import User from "@/models/User";

interface AuthRequest extends Request {
  user?: any;
}

export const clearAuthCookies = (res: Response) => {
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
};

const authMiddlewareForInterceptor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      console.log("No access token found in cookies");
      res.status(HttpCode.UNAUTHORIZED).json({
        message: "Access token required",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;


    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).json({
        message: "User not found",
      });
      return;
    }

    req.user = { id: decoded.userId, role: user.role };
    next();
  } catch (error) {
    console.log("Token verification failed:", error);

    if (error instanceof jwt.TokenExpiredError) {
      console.log("Access token expired");
      res.status(HttpCode.UNAUTHORIZED).json({
        message: "Access token expired",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      console.log("Invalid access token");
      res.status(HttpCode.UNAUTHORIZED).json({
        message: "Invalid access token",
      });
      return;
    }

    res.status(HttpCode.UNAUTHORIZED).json({
      message: "Authentication failed",
    });
    return;
  }
};

export default authMiddlewareForInterceptor;
