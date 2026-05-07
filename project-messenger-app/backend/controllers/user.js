import prisma from "../prisma/db.js";

const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role, gender } = req.body;

    const user = await prisma.user.create({
      data: { username, name, email, password, role, gender },
    });

    return res.status(201).json({
      message: "User successfully created",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default {
    createUser
}