import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const heathCheck = asyncHandler(async (req, res) => {
   res
   .status(200)
   .json(new ApiResponse(200, { success: true}, "Server is Running."));
});

export { heathCheck };
