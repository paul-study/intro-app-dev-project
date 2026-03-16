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
  // Omitted for brevity
};

const getDepartment = async (req, res) => {
  // Omitted for brevity
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
  // Omitted for brevity
};

export {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};