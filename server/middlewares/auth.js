import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";

const userAuth = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    throw new ApiError(400, "Unauthorised request");
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken.id) {
    throw new ApiError(400, "bad token");
  }
  req.user = { id: decodedToken.id };
  next();
});

export default userAuth;
