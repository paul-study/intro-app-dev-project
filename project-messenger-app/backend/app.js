import express from "express";
import cors from "cors";
import compression from "compression";

import userRoutes from "./routes/user.js"

import isContentTypeApplicationJSON from "./middleware/content-type.js";
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";

import conversationRoutes from "./routes/conversations.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.json());

app.use(isContentTypeApplicationJSON); //checking the middleware content type

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/health", healthRoutes);
app.use("/api/conversations", conversationRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`
  );
});

export default app;
