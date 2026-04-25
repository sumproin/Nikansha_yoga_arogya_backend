import { Router } from "express";
import { createAdminToken, requireAdmin, validateAdminCredentials } from "../utils/adminAuth";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required." });
  }

  if (!validateAdminCredentials(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = createAdminToken(username);
  return res.json({ token });
});

router.get("/verify", requireAdmin, (_req, res) => {
  return res.json({ valid: true });
});

export default router;
