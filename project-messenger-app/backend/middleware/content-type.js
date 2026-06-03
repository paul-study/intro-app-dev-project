const isContentTypeApplicationJSON = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    const contentType = req.headers["content-type"] || "";
    if (!contentType || !contentType.startsWith("application/json")) {
      return res.status(409).json({ message: "Content-Type must be application/json" });
    }
  }
  next();
};

export default isContentTypeApplicationJSON;