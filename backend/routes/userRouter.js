import express from "express";

import {
  currentUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/userController.js";

import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", requireAuth, currentUser);
router.get("/users", requireAuth, requireRole("ADMIN"), getUsers);
router.get("/users/:id", requireAuth, requireRole("ADMIN"), getUserById);
router.patch("/users/:id", requireAuth, requireRole("ADMIN"), updateUser);
router.delete("/users/:id", requireAuth, requireRole("ADMIN"), deleteUser);

export default router;
