import prisma from "../prisma/db.js";
import userRepository from "../repositories/user.js";


export const createUser = async (req, res) => {
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
export const getUsers = async (req, res) => {
  try {
    const users = await userRepository.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({
        message: `No user with the id: ${id} found`,
      });
    }
    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, name, email, password, role, gender } = req.body;
    let user = await userRepository.findById(id);
    if (!user) {
      return res.status(404).json({
        message: `No user with the id: ${id} found`,
      });
    }
    user = await userRepository.update(id, {
      username,
      name,
      email,
      password,
      role,
      gender,
    });
    return res.status(200).json({
      message: `User with id: ${id} successsfully updated`,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const deleteUser = async (req,res) => {
    try {
        const {id} = req.params;
        const user =  await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({
                message: `No user with the id: ${id} found`
            })
        }
        await userRepository.delete(id);
        return res.status(200).json({
            message: `User with id: ${id} successsfully deleted`,
        });
    } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// export default {
//   createUser,
//   getUsers,
//   getUser,
//   updateUser,
//   deleteUser
// };
