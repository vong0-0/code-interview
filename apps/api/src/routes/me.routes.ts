import { Router } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { requireAuth } from "../middleware/requireAuth.js";

const router: Router = Router();

router.get("/", requireAuth, async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

export default router;
