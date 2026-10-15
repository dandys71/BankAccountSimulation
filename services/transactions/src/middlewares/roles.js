// middlewares/roles.js
export function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Nejprve se přihlas" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Nemáš oprávnění" });
    }

    next();
  };
}
