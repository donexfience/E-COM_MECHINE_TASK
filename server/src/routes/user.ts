import UserController from "@/controllers/userController";
import express from "express";

const router = express.Router();
const userController = new UserController();
router.get("/profile", userController.getProfile.bind(userController));
router.get("/all", userController.getAllUsers.bind(userController));

export default router;
