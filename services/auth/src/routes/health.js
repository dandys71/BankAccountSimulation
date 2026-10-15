
import { Router } from 'express';
export const router = Router();

router.get('/ping', (_req, res) => {
  res.json({ ok: true, service: 'AuthManager', time: new Date().toISOString() });
});
