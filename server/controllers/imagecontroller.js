import axios from "axios";
import { userModel } from "../models/userModel.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import FormData from "form-data";
import { ApiResponse } from "../utils/apiResponse.js";

const generateImage = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(id);
  const { prompt } = req.body;
  console.log(prompt);
  if (!id || !prompt) {
    throw new ApiError(401, "missing details");
  }
  const user = await userModel.findById(id);
  if (!user) {
    throw new ApiError(401, "user not found");
  }
  if (user.creditBalance === 0 || userModel.creditBalance < 0) {
    new ApiResponse(402, user, "No credit Balance");
  }

  const formData = new FormData();
  formData.append("prompt", prompt);
  const { data } = await axios.post(
    "https://clipdrop-api.co/text-to-image/v1",
    formData,
    {
      headers: {
        "x-api-key": process.env.CLIPDROP_API,
      },
      responseType: "arraybuffer",
    },
  );
  const base64Image = Buffer.from(data, "binary").toString("base64");
  if (!base64Image) {
    throw new ApiError(402, "base64image not generated");
  }
  const resultImage = `data:image/png;base64,${base64Image}`;
  if (!resultImage) {
    throw new ApiError(402, "resultImage not generated");
  }
  await userModel.findByIdAndUpdate(user._id, {
    creditBalance: user.creditBalance - 1,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        resultImage,
      },
      "Image generated",
    ),
  );
});

export { generateImage };
