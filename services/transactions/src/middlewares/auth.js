import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/const.js";

/**
 * Ověří Bearer JWT (stejný JWT_SECRET jako AuthManager).
 * Do req.user dá payload + normalizované id/userId.
 */
export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = auth.slice(7);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: "Neplatný token" });
    }

    const userId = payload.userId || payload.id || payload.sub;
    req.user = {
      ...payload,
      id: userId,
      userId,
    };
    next();
  });
}
