import prisma from "../prisma/db.js";

export const createMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user.id;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: true,
        conversation: true,
      },
    });

    return res.status(201).json({ data: message });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    const { conversationId } = req.query;

    const where = conversationId ? { conversationId } : {};

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: true,
        conversation: {
          include: {
            participants: true,
          },
        },
      },
      orderBy: { timestamp: "asc" },
    });

    const filtered = isAdmin
      ? messages
      : messages.filter((message) =>
          message.conversation.participants.some(
            (participant) => participant.userId === userId
          )
        );

    return res.status(200).json({ data: filtered });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: true,
        conversation: {
          include: {
            participants: true,
          },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isParticipant = message.conversation.participants.some(
      (participant) => participant.userId === userId
    );

    if (!isAdmin && !isParticipant) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ data: message });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    const { content, isRead, isEdited, messageStatus } = req.body;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        conversation: {
          include: { participants: true },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isOwner = message.senderId === userId;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Only the sender or admin can update this message" });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: {
        content,
        isRead,
        isEdited,
        messageStatus,
      },
      include: {
        sender: true,
        conversation: true,
      },
    });

    return res.status(200).json({ data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isOwner = message.senderId === userId;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Only the sender or admin can delete this message" });
    }

    await prisma.message.delete({ where: { id } });
    return res.status(200).json({ message: `Message ${id} deleted` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};