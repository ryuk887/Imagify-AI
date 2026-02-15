import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb_config.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(PORT, () => {
  console.log("server running on port:" + PORT);
});
