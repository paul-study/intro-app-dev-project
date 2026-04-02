import express from "express";
import rbac from "../middleware/rbac.js";

import {
    createDepartment,
    getDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment
} from "../controllers/department.js"

const router = express.Router();

router.post("/",rbac(["ADMIN","STAFF"]), createDepartment);
router.get("/",rbac(["ADMIN","STAFF","STUDENT"]), getDepartments);
router.get("/:id",rbac(["ADMIN","STAFF","STUDENT"]), getDepartment);
router.put("/:id",rbac(["ADMIN","STAFF"]), updateDepartment);
router.put("/",rbac(["ADMIN","STAFF"]), (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});
router.delete("/:id",rbac(["ADMIN"]), deleteDepartment);
router.delete("/",rbac(["ADMIN"]), (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});

export default router