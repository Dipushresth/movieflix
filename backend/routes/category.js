import express from "express";
import { getCategories, category } from "../controller/categoryController.js";
const router = express.Router();

router.post("/category", category);
router.get("/categories", getCategories);

export default router;
