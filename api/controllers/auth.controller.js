import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, "Some fields are missing"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();

    res.status(201).json("User created successfully!");
  } catch (err) {
    console.log(next(err));
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "Some fields are missing"));
    }
    const validUser = await User.findOne({ email });

    if (!validUser) return next(errorHandler(400, "User not Found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(401, "Wrong Credential!"));
    const token = await jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET_KEY
    );
    const { password: _, ...withoutPassword } = validUser.toObject();
    return res
      .cookie("access_token", token, { httpOnly: true })
      .json(withoutPassword);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY
      );
      const { password: pass, ...withOutPassword } = user._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .json(withOutPassword);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const username =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(32).slice(-4);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar,
      });

      await newUser.save();

      const token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY
      );

      const { password: pass, ...withOutPassword } = newUser._doc;
      return res
        .cookie("access_token", token, httpOnly)
        .status(201)
        .json(withOutPassword);
    }
  } catch (error) {
    next(error);
  }
};
