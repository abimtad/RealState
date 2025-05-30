import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MOngoDB");
  })
  .catch((err) => {
    console.log(err);
  });

console.log("present");
const app = express();
const dirName = path.resolve();

app.use(express.static(path.join(dirName, "client/dist")));

const joined = app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(dirName, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 !!");
});
