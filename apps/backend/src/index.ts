import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

// routes
import authRoute from "./routes/auth.js";
import contentRoute from "./routes/content.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/", contentRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port " + (process.env.PORT || 3000));
});
