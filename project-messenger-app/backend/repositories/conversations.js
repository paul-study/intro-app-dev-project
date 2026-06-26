import prisma from "../prisma/db";

class ConversationRepository {
  async create(data) {
    return await prisma.conversation.create({ data });
  }
  async findAll(where = {}) {
    return await prisma.conversation.findMany({
      where,
      include: {
        participants: {
          include: { user: { select: { id: true, username: true, name: true } } }
        }
      }
    });
  }

  async findById(id) {
    return await prisma.conversation.findUnique({
      where: { id },
      include: { participants: true },
    });
  }

  async update(id, data) {
    return await prisma.conversation.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.conversation.delete({ where: { id } });
  }
}

export default new ConversationRepository();