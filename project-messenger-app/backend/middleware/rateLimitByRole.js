const counts = new Map();

const limits = {
  ADMIN: 100,
  USER: 100,
};

const rateLimitByRole = (req, res, next) => {
  const role = req.user?.role || "USER";
  const id = req.user?.id || req.ip;
  const key = `${role}:${id}`;
  const limit = limits[role] || limits.USER;

  const current = counts.get(key) || 0;

  if (current >= limit) {
    return res.status(429).json({ message: "Too many requests" });
  }

  counts.set(key, current + 1);
  next();
};

export default rateLimitByRole;