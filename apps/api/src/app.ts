import express, { type Express } from "express"
import cors from "cors"
import "./lib/dotenv.js"
import { corsOptions } from "./config/cors.js"

import authRoutes from "./routes/auth.routes.js"
import meRoutes from "./routes/me.routes.js"
import roomRoutes from "./routes/rooms.routes.js"
import questionRoutes from "./routes/questions.routes.js"

const app: Express = express()

app.use(cors(corsOptions))

const API_PREFIX = "/api/v1"

app.use(`${API_PREFIX}/auth`, authRoutes)
app.use(`${API_PREFIX}/me`, meRoutes)

app.use(express.json())

app.use(`${API_PREFIX}/rooms`, roomRoutes)
app.use(`${API_PREFIX}/questions`, questionRoutes)

export default app
