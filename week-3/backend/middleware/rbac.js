const rbac = (requiredRole) => {
  return (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden. User is not authenticated" });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({
        message: `Forbidden. Insufficient privileges for role: ${user.role}`,
      });
    }

    next();
  };
};

export default rbac;