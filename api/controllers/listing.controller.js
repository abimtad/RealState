import { Listing } from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can only view your own listings"));
  try {
    const listings = await Listing.find({ userRef: req.user.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const deleteUserListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(400, "Listing isnt found !"));
    if (req.user.id !== listing.userRef)
      return next(errorHandler(403, "You can only delete your own listings"));

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing deleted successfully !");
  } catch (error) {
    next(error);
  }
};

export const updateUserListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listing !"));
  }

  try {
    console.log(req.body);
    // QUESTIONS: what is the diff between just using req.body or updating via $set?
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // QUESTIONS: runValidotors dont seem to do anything. what is its value?
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return next(errorHandler(404, "Listing not found !"));

    res.json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    console.log("preset inside getlisting");
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    let offer = req.query.offer;

    if (offer === undefined || offer === "false")
      offer = { $in: [true, false] };

    let parking = req.query.parking;

    if (parking === undefined || parking === "false")
      parking = { $in: [true, false] };

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false")
      furnished = { $in: [true, false] };

    let type = req.query.type;

    if (type === undefined || type === "false")
      type = { $in: ["sell", "rent"] };

    let listing = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      type,
      parking,
    })
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    res.json(listing);
  } catch (error) {
    next(error);
  }
};
