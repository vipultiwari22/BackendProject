import express from "express";
import cors from "cors";
import cookiePasrser from "cookie-parser";
import morgan from "morgan";
import connectionToDb from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import { config } from "dotenv";
import errrMiddleware from "./middleware/error.middleware.js";
import courseRoute from "./routes/course.Routs.js";
import paymentroute from "./routes/payment.route.js";
config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
  })
);

connectionToDb();
app.use(morgan("dev"));

app.use(cookiePasrser());

app.use("/ping", (req, res) => {
  res.send("Pong");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/payments", paymentroute);

app.all("*", (req, res) => {
  res.status(400).send("OOPS! 404 page not found");
});

app.use(errrMiddleware);
export default app;
