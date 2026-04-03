import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 5, // Max 5 requests per window per IP
  standardHeaders: true, // Add rate limit info to RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    message: "Too many requests, please try again later",
  },
});

export default rateLimiter;