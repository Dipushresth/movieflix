import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
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

app.use(express.json());
app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);
app.use("/uploads", express.static("uploads"));
app.use("/", authRouter);
app.use("/", movieRouter);
app.use("/", categoryRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Movie API is running",
  });
});

//development mode
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });

//prod
export default app;
