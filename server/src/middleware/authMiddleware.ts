import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "@/models/User";
import {
  generateAccessToken,
  validateRefreshTokenWithUser,
} from "@/utils/token";
import { HttpCode } from "@/utils/constants";

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;
    const userId = req.cookies?.userId;

    console.log(
      accessToken,
      userId,
      "got both from cookiesssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"
    );

    if (!accessToken) {
      if (!userId) {
        res.status(HttpCode.UNAUTHORIZED).json({
          message: "No authentication found - please login",
          code: "NO_AUTH_FOUND",
        });
        return;
      }

      const refreshResult = await handleTokenRefreshFromDB(userId, res);
      if (!refreshResult.success) {
        return;
      }

      req.user = refreshResult.user;
      next();
      return;
    }

    // verifying the existing access token
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET!
      ) as any;

      req.user = {
        id: decoded.id,
      };

      next();
      return;
    } catch (err) {
      // Access token expired or invalid, try to refresh using userId and database
      if (!userId) {
        clearAuthCookies(res);
        res.status(HttpCode.UNAUTHORIZED).json({
          message: "Access token expired and no user ID found",
          code: "TOKEN_EXPIRED_NO_USER_ID",
        });
        return;
      }

      const refreshResult = await handleTokenRefreshFromDB(userId, res);
      if (!refreshResult.success) {
        return;
      }

      req.user = refreshResult.user;
      next();
      return;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      message: "Authentication middleware failed",
      code: "AUTH_ERROR",
    });
    return;
  }
};

// Helper function to handle token refresh from database
const handleTokenRefreshFromDB = async (
  userId: string,
  res: Response
): Promise<{ success: boolean; user?: any }> => {
  try {
    const user: any = await User.findById(userId).select("+refreshToken");

    if (!user || !user.refreshToken) {
      clearAuthCookies(res);
      res.status(HttpCode.UNAUTHORIZED).json({
        message: "No valid refresh token found for user",
        code: "NO_REFRESH_TOKEN_FOUND",
      });
      return { success: false };
    }

    const validatedUser = await validateRefreshTokenWithUser(user.refreshToken);

    if (!validatedUser) {
      await User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: "" },
      });

      clearAuthCookies(res);
      res.status(HttpCode.UNAUTHORIZED).json({
        message: "Invalid refresh token - please login again",
        code: "REFRESH_TOKEN_INVALID",
      });
      return { success: false };
    }

    const newAccessToken = generateAccessToken(validatedUser._id.toString());

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 1000,
    });

    return {
      success: true,
      user: {
        id: validatedUser._id.toString(),
        username: validatedUser.username,
      },
    };
  } catch (error) {
    console.error("Token refresh from DB error:", error);
    clearAuthCookies(res);
    res.status(HttpCode.UNAUTHORIZED).json({
      message: "Token refresh failed",
      code: "TOKEN_REFRESH_ERROR",
    });
    return { success: false };
  }
};

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

export default authMiddleware;
