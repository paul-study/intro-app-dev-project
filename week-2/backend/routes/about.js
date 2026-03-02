import express from "express";

import { getLearnerInfo } from "../controllers/about.js";

const router = express.Router();

router.get("/about", getLearnerInfo); 

export default router;
