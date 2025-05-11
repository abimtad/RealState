import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return errorHandler(403, "You can only update your data");
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    //   TODO:  if the user the sends the same credential as the old one to update le them know they sent the same data as the old one

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );

    res.json({ ...updatedUser._doc, password: undefined });
  } catch (error) {
    next(error);
  }
};
