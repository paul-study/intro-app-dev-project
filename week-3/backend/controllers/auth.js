import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../prisma/db.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password, role } = req.body;

    // Check if user already exists
    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password with a unique salt
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    const createdUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      message: "User successfully registered",
      data: createdUser,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email address" });
    }

    // Compare provided password against the stored hash
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    if (!JWT_SECRET || !JWT_LIFETIME) {
      return res.status(500).json({
        message:
          "JWT_SECRET and JWT_LIFETIME must be defined in environment variables",
      });
    }

    // Sign a token containing the user's ID and role
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_LIFETIME,
    });

    return res.status(200).json({
      message: "User successfully logged in",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { register, login };