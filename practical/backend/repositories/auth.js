import prisma from "../prisma/db.js";

class AuthRepository {
  async findByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async create(data) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }
}

export default new AuthRepository();