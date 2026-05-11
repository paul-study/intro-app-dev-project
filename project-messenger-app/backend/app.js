import express from "express";
import cors from "cors";
import compression from "compression";

import userRoutes from "./routes/user.js"

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.json()); 

app.use("/api/users", userRoutes)

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`
  );
});

export default app;
