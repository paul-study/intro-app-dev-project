import express from "express";

// Import the index controllers module
import { getPersonInfo, getProgLangs } from "../controllers/index.js";

// Create an Express router
const router = express.Router();

// Create a GET routes
router.get("/", getPersonInfo); // The first argument is the route path, the second argument is the controller function
router.get("/progLangs", getProgLangs);

// Export the router
export default router;
