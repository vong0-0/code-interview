import express, { type Router } from "express"
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questions.controller.js"
import { requireAuth } from "../middleware/requireAuth.js"

const router: Router = express.Router()

router.get("/", requireAuth, getQuestions)
router.get("/:id", requireAuth, getQuestion)
router.post("/", requireAuth, createQuestion)
router.put("/:id", requireAuth, updateQuestion)
router.delete("/:id", requireAuth, deleteQuestion)

export default router
