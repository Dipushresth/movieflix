import express from "express";

import {
  createMovie,
  getMovies,
  getMovie,
  updateMovie,
  patchMovie,
} from "../controller/movieController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/movies", upload.single("image"), createMovie);

router.get("/movies", getMovies);

router.get("/movies/:id", getMovie);

router.put("/movies/:id", upload.single("image"), updateMovie);

export default router;
