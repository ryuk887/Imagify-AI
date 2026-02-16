import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(401, "Missing details");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (!hashedPassword) {
    throw new ApiError(400, "password hashing issue");
  }
  const userData = {
    name,
    email,
    password: hashedPassword,
  };
  const newUser = new userModel(userData);
  const user = await newUser.save();
  if (!user) {
    throw new ApiError(400, "user creation issue");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  if (!token) {
    throw new ApiError(400, "token generation issue");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { token, user }, "user registered successful"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required.");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    throw new ApiError(401, "Invalid credentials");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  if (!token) {
    throw new ApiError(400, "token generation issue");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { token, user }, "user Login successful"));
});

const userCredit = asyncHandler(async (req, res) => {
  const { id } = req.user;
  if (!id) {
    throw new ApiError(401, "User id is required");
  }
  const user = await userModel.findById(id);
  if (!user) {
    throw new ApiError(402, "user not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { name: user.name, creditBalance: user.creditBalance },
        "user credits fetched successfully",
      ),
    );
});

export { registerUser, loginUser, userCredit };
