import express, { type Express } from "express";
import cors from "cors";
import "./lib/dotenv.js";
import authRoutes from "./routes/auth.routes.js";
import meRoutes from "./routes/me.routes.js";
import { corsOptions } from "./config/cors.js";

const app: Express = express();

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
