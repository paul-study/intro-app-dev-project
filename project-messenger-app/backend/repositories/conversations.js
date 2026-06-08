import prisma from "../prisma/db";

class ConversationRepository {
  async create(data) {
    return await prisma.conversation.create({ data });
  }
  async findAll() {
    return await prisma.conversation.findMany();
  }

  async findById(id) {
    return await prisma.conversation.findUnique({ where: { id } });
  }

  async update(id, data) {
    return await prisma.conversation.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.conversation.delete({ where: { id } });
  }
}

export default new ConversationRepository();