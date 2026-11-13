export function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Nejprve se přihlas" });
    }

    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.role, req.user.roles].filter(Boolean);

    const ok = allowedRoles.some((role) => userRoles.includes(role));
    if (!ok) {
      return res.status(403).json({ error: "Nemáš oprávnění" });
    }

    next();
  };
}
