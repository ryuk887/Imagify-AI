import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb_config.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(
  cors({
    origin: "imagify-ai-ashen.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());

connectDB();

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

app.listen(PORT, () => {
  console.log("server running on port:" + PORT);
});
