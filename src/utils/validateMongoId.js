import { ApiError } from "./ApiError.js";
import mongoose from "mongoose";

export const validateMongoId = (id) => {
   if (!id?.trim()) throw new ApiError(400, "ID is missing");

   if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid ID.");
};

