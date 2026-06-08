import repos from "../repositories/index.js";
import { clearCacheStore } from "../middleware/cache.js";

export const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role, gender } = req.body;

    const user = await repos.User.create({
      username,
      name,
      email,
      password,
      role,
      gender,
    });
    clearCacheStore();

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
    const users = await repos.User.findAll();
    if (!users || users.length === 0) {
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
    const user = await repos.User.findById(id);
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
    const user = await repos.User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: `No user with the id: ${id} found`,
      });
    }

    const updated = await repos.User.update(id, {
      username,
      name,
      email,
      password,
      role,
      gender,
    });
    clearCacheStore();
    return res.status(200).json({
      message: `User with id: ${id} successfully updated`,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await repos.User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: `No user with the id: ${id} found`,
      });
    }
    await repos.User.delete(id);
    clearCacheStore();
    return res.status(200).json({
      message: `User with id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};