import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createRoom } from "../controllers/rooms.controller.js";

const router: Router = Router();

router.post("/", requireAuth, createRoom);

export default router;
