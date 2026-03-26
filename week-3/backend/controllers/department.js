import prisma from "../prisma/db.js";

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;

    await prisma.department.create({
      data: { name, institutionId },
    });

    const departments = await prisma.department.findMany();

    return res.status(201).json({
      message: "Department successfully created",
      data: departments,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();

    if (departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    return res.status(200).json({
      data: departments,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    // Check if there is no institution
    if (!department) {
      return res.status(404).json({
        message: `No departments with the id: ${id} found`,
      });
    }

    return res.status(200).json({
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, institutionId } = req.body;
    let department = await prisma.department.findUnique({ where: { id } });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    department = await prisma.department.update({
      where: { id },
      data: { name, institutionId },
    });

    return res.status(200).json({
      message: `Department with the id: ${id} successfully updated`,
      data: department,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    await prisma.department.delete({
      where: { id },
    });

    return res.status(200).json({
      message: `department with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};