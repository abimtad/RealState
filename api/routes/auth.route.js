import express from "express";
import {
  signIn,
  signUp,
  google,
  signOut,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/google", google);
router.post("/signOut", signOut);

export default router;
