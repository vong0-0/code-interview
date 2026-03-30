import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import {
  createRoom,
  getRoom,
  getRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/rooms.controller.js"

const router: Router = Router()

router.get("/", requireAuth, getRooms)
router.get("/:code", getRoom)
router.post("/", requireAuth, createRoom)
router.put("/:code", requireAuth, updateRoom)
router.delete("/:code", requireAuth, deleteRoom)

export default router
