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
    if (!accessToken) {
      res.status(HttpCode.UNAUTHORIZED).json({
        message: "Access token missing from cookies",
        code: "TOKEN_MISSING",
      });
      return;
    }

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
      try {
        const expiredTokenPayload = jwt.decode(accessToken) as any;
        if (!expiredTokenPayload || !expiredTokenPayload.id) {
          res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          res.status(HttpCode.UNAUTHORIZED).json({
            message: "Invalid access token format",
            code: "INVALID_TOKEN_FORMAT",
          });
          return;
        }

        const userId = expiredTokenPayload.id;
        const user: any = await User.findById(userId).select("+refreshToken");

        if (!user || !user.refreshToken) {
          res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          res.status(HttpCode.UNAUTHORIZED).json({
            message: "No valid refresh token found for user",
            code: "NO_REFRESH_TOKEN_FOUND",
          });
          return;
        }

        const validatedUser = await validateRefreshTokenWithUser(
          user.refreshToken
        );

        if (!validatedUser) {
          await User.findByIdAndUpdate(userId, {
            $unset: { refreshToken: "" },
          });
          res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          res.status(HttpCode.UNAUTHORIZED).json({
            message: "Invalid refresh token - please login again",
            code: "REFRESH_TOKEN_INVALID",
          });
          return;
        }

        const newAccessToken = generateAccessToken(
          validatedUser._id.toString()
        );


        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 2 * 60 * 1000,
        });

        req.user = {
          id: validatedUser._id.toString(),
          username: validatedUser.username,
        };

        next();
        return;
      } catch (decodeError) {
        console.error("Error decoding expired token:", decodeError);
        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.status(HttpCode.UNAUTHORIZED).json({
          message: "Could not process expired token",
          code: "TOKEN_DECODE_ERROR",
        });
        return;
      }
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

export default authMiddleware;
