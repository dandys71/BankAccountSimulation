import jwt from "jsonwebtoken";

import { JWT_SECRET }  from '../config/const.js';

/**
 * Velmi jednoduchý middleware, který z requestu načte hlavičku Authorization.
 * Zatím jen zkontroluje, že existuje, a "předstírá" identitu uživatele.
 * Později se sem doplní skutečné ověření a čtení rolí.
 */
export function authMiddleware(req, res, next) {
  if (req.path.startsWith('/v1/health')) return next(); // health bez auth
  const auth = req.headers['authorization'];
  if (!auth) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  // const token = auth.slice(7);
  // // TODO: ověřit podpis a exp, vyčíst role/scope
  // req.user = { id: 'demo-user', roles: ['USER'], token };
  const token = auth.split(' ')[1]; // Bearer <token>

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Neplatný token" });

    req.user = user; // přidáme payload do requestu
    next();
  });

  next();
}
