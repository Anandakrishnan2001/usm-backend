import express from "express";
import {
  getUsers,
  updateUserProfile,
  deleteUser,
} from "../Controllers/userController";
import { adminLogin } from "../Controllers/authController";

const router = express.Router();

 router.post("/login", adminLogin);
 router.get("/users", getUsers);
 router.delete("/users/:id", deleteUser);
router.patch("/users/:id", updateUserProfile);

export default router;