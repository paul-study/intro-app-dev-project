export const authorize = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (!allowedRoles.length || allowedRoles.includes(req.user.role)) return next();
  return res.status(403).json({ message: "Forbidden" });
};

export const ownerOrAdmin = (idParam = "id") => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role === "ADMIN") return next();
  if (req.user.id && req.params[idParam] && req.user.id === req.params[idParam]) return next();
  return res.status(403).json({ message: "Forbidden" });
};
export default authorize;