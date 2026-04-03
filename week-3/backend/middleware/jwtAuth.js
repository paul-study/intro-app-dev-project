import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    // Authorization header should be: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token against the secret key
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request for use in downstream handlers
    req.user = payload;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

export default jwtAuth;