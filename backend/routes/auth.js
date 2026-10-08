import express from "express";
import { register } from "../controller/auth/register.js";
import { login } from "../controller/auth/login.js";
import { refresh } from "../controller/auth/refresh.js";
import { logout } from "../controller/auth/logout.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
