import express from "express";

import {
  createMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie,
} from "../controller/movieController.js";
import upload from "../middleware/upload.js";
import { requireRole, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/movies",
  upload.single("image"),
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  createMovie,
);

router.get("/movies", getMovies);

router.get("/movies/:id", getMovie);

router.put(
  "/movies/:id",
  upload.single("image"),
  requireAuth,
  requireRole("ADMIN"),
  updateMovie,
);
router.delete("/movies/:id", requireAuth, requireRole("ADMIN"), deleteMovie);

export default router;
