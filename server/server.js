import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb_config.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const PORT = process.env.PORT || 4000;
const app = express();

const origins = [
  "http://localhost:5173/",
  "https://imagify-ai-ashen.vercel.app",
];

app.use(
  cors({
    origin: "http://localhost:5173",
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
