import express from "express";
import { registerUser,updateUserProfile } from "../Controllers/userController";
import { login, refreshToken } from "../Controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
  router.put('/profile/:id', updateUserProfile);
// router.delete("/:id", verifyToken, deleteUser);
// router.get("/me", verifyToken, getUserProfile);

export default router;