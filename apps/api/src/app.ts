import express, { type Express } from "express";
import cors from "cors";
import "./lib/dotenv.js";
import { corsOptions } from "./config/cors.js";

import authRoutes from "./routes/auth.routes.js";
import meRoutes from "./routes/me.routes.js";
import roomsRoutes from "./routes/rooms.routes.js";

const app: Express = express();

app.use(cors(corsOptions));

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/me`, meRoutes);

app.use(express.json());

app.use(`${API_PREFIX}/rooms`, roomsRoutes);

export default app;
