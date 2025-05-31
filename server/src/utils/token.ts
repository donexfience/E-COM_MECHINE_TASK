import User from "@/models/User";
import { UserData } from "@/types/Iuser";
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || "your_jwt_secret",
    {
      expiresIn: "2m",
    }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || "your_refresh_secret",
    { expiresIn: "7d" }
  );
};

// Token validation functions
export const validateAccessToken = (token: string): { id: string } | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "your_jwt_secret"
    ) as { id: string };
    return decoded;
  } catch (error) {
    console.error("Access token validation error:", error);
    return null;
  }
};

export const validateRefreshToken = (token: string): { id: string } | null => {
  console.log(token, "refreshtoken", process.env.JWT_REFRESH_SECRET);
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "your_refresh_secret"
    ) as { id: string };
    return decoded;
  } catch (error) {
    console.error("Refresh token validation error:", error);
    return null;
  }
};

export const validateRefreshTokenWithUser = async (
  token: string
): Promise<UserData | null> => {
  try {
    const decoded = validateRefreshToken(token);
    if (!decoded) return null;

    const user: UserData | null = await User.findById(decoded.id).select(
      "+refreshToken"
    );

    if (!user || user.refreshTokens !== token) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Refresh token with user validation error:", error);
    return null;
  }
};
