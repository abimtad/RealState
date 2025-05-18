import express from "express";
import {
  createListing,
  deleteUserListing,
  getUserListing,
  getUserListings,
  updateUserListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/:id", verifyToken, getUserListings);
router.delete("/delete/:id", verifyToken, deleteUserListing);
router.put("/update/:id", verifyToken, updateUserListing);
router.get("/get/:id", getUserListing);
router.get("/", getListings);

export default router;
