import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/userRouter.js";
import movieRouter from "./routes/movie.js";
import categoryRouter from "./routes/category.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

app.use(cookieParser());
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", movieRouter);
app.use("/", categoryRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Movie API is running",
  });
});

//development mode
// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });
//prod
export default app;
