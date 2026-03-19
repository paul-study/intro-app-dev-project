// Import the Express, CORS and Compression modules
import express from "express";
import cors from "cors";
import compression from "compression";

// Import the index routes module
import indexRoutes from "./routes/index.js";
import aboutRouter from "./routes/about.js";
import coursesRouter from "./routes/course.js";
import institutionRoutes from "./routes/institution.js";
import departmentRoutes from "./routes/department.js";
import userRoutes from "./routes/user.js"

import isContentTypeApplicationJSON from "./middleware/content-type.js";

// Create an Express application
const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// Use the API_BASE_URL environment variable or localhost
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

// Enable CORS and Compression
app.use(cors());
app.use(compression());

// These middleware functions must be declared before the routes
app.use(express.urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads. For example, form data
app.use(express.json()); // To parse the incoming requests with JSON payloads. For example, REST API requests

app.use(isContentTypeApplicationJSON); //checking the middleware content type

// Use the routes module
app.use("/", indexRoutes);
app.use("/", aboutRouter);
app.use("/", coursesRouter);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/users", userRoutes)

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`
  );
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
