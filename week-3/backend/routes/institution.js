import express from "express";

import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation/institution.js";

import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

// router.post(
//   "/",
//   validatePostInstitution,
//   jwtAuth,
//   rbac("ADMIN"),
//   createInstitution,
// );

// router.get("/", rateLimiter, getInstitutions);
// router.get("/:id", rateLimiter, getInstitution);

// router.post("/", validatePostInstitution, jwtAuth, createInstitution);
router.post("/",validatePostInstitution, createInstitution);

router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.put("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});
router.delete("/:id", deleteInstitution);
router.delete("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});

// Note: You can chain the routes like this -
// router.route("/").post(createInstitution).get(getInstitutions);

export default router;