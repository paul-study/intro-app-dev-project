const rbac = (requiredRole) => {
  return (req, res, next) => {
    const { user } = req;

    if (process.env.NODE_ENV !== "development") {
        return res
        .status(403)
        .json({message: "NODE_ENV is not set to development" });
    }

    if (!user || !user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden. User is not authenticated" });
    }

    if (requiredRole.includes(user.role)){
      next()
    } else {
      return res.status(403).json({
        message: `Forbidden. Insufficient privileges for role: ${user.role}`,
      });
    }

    
  
    
    // if (user.role !== requiredRole) {
    //   return res.status(403).json({
    //     message: `Forbidden. Insufficient privileges for role: ${user.role}`,
    //   });
    // }

    // next();
  };
};

export default rbac;