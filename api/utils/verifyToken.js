import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const verifyToken = (req, res, next) => {
  console.log(req.headers.cookie);
  const token = req.cookies.access_token;

  if (!token) return errorHandler(401, "Unauthorized");

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return errorHandler(401, "Invalid Token");

    req.user = user;
    next();
  });
};
