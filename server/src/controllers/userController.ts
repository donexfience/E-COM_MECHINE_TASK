import { Request, Response } from "express";
import { HttpCode } from "@/utils/constants";
import User, { IUser } from "@/models/User";

class UserController {
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

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        search = "",
        startDate,
        endDate,
        page = "1",
        limit = "10",
      } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
      const skip = (pageNumber - 1) * pageSize;

      const filter: any = {};

      if (search) {
        filter.name = { $regex: search as string, $options: "i" };
      }

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate as string);
        if (endDate) filter.createdAt.$lte = new Date(endDate as string);
      }

      const total = await User.countDocuments(filter);
      const users = await User.find({ ...filter, role: { $ne: "admin" } }) 
        .select("-password")
        .skip(skip)
        .limit(pageSize);

      res.status(200).json({
        total,
        page: pageNumber,
        pageSize,
        users,
      });
    } catch (error) {
      console.log(error, "error fetching all user");
      res.status(500).json({
        message: "Error fetching Users",
        error,
      });
    }
  }
}

export default UserController;
