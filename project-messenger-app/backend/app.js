import express from "express";
import cors from "cors";
import compression from "compression";

import userRoutes from "./routes/user.js"

import isContentTypeApplicationJSON from "./middleware/content-type.js";
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";

import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js";
import conversationParticipantRoutes from "./routes/conversationParticipants.js";
import friendshipRoutes from "./routes/friendships.js";
import userSettingsRoutes from "./routes/userSettings.js";

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
app.use("/api/messages", messageRoutes);
app.use("/api/conversation-participants", conversationParticipantRoutes);
app.use("/api/friendships", friendshipRoutes);
app.use("/api/user-settings", userSettingsRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`
  );
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
