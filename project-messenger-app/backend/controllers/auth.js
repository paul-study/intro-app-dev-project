import prisma from "../prisma/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "MySuperSecretKeyChangeInProduction256Bits";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const register = async (req, res) => {
  try {
    const { username, name, email, password, role, gender } = req.body;
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) return res.status(409).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, name, email, password: hashed, role, gender },
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _p, ...safe } = user;
    return res.status(201).json({ token, user: safe });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _p, ...safe } = user;
    return res.status(200).json({ token, user: safe });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out — delete token client-side" });
};