import prisma from "../prisma/db.js";
import conversationRepository from "../repositories/conversations.js";

export const createConversation = async (req, res) => {
  try {
    const { title, isGroup = false, chatType = "DIRECT" } = req.body;
    const creatorId = req.user.id;

    const conversation = await prisma.conversation.create({
      data: {
        title,
        isGroup,
        chatType,
        creator: { connect: { id: creatorId } },
        participants: {
          create: [
            {
              user: { connect: { id: creatorId } },
              participantRole: "ADMIN",
            },
          ],
        },
      },
      include: {
        participants: { include: { user: true } },
      },
    });

    return res.status(201).json({ data: conversation });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    const conversations = await prisma.conversation.findMany({
      where: isAdmin ? {} : { participants: { some: { userId } } },
      include: {
        participants: { include: { user: true } },
        messages: { take: 1, orderBy: { timestamp: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ data: conversations });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: { include: { user: true } },
        messages: { include: { sender: true }, orderBy: { timestamp: "asc" } },
      },
    });

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    const isParticipant = conversation.participants.some(
      (p) => p.userId === userId
    );
    if (!isAdmin && !isParticipant)
      return res.status(403).json({ message: "Forbidden" });

    return res.status(200).json({ data: conversation });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    const { title, isGroup, chatType } = req.body;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    if (!isAdmin && conversation.creatorId !== userId) {
      return res
        .status(403)
        .json({
          message: "Only the creator or admin can update this conversation",
        });
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: { title, isGroup, chatType },
      include: { participants: { include: { user: true } } },
    });

    return res.status(200).json({ data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    const conversation = await conversationRepository.findById(id);
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    if (!isAdmin && conversation.creatorId !== userId) {
      return res
        .status(403)
        .json({
          message: "Only the creator or admin can delete this conversation",
        });
    }

    await conversationRepository.delete(id);
    return res.status(200).json({ message: `Conversation ${id} deleted` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
