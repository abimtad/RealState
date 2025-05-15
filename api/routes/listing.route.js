import express from "express";
import {
  createListing,
  getUserListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/:id", verifyToken, getUserListings);

export default router;
