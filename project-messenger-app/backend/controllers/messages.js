import repos from "../repositories/index.js";

export const createMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user.id;

    const conversation = await repos.Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const message = await repos.Message.create({
      conversationId,
      senderId,
      content,
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
    const messages = await repos.Message.findAll(where);
    
    if (!isAdmin && conversationId) {
      const conv = await repos.Conversation.findById(conversationId);
      const isParticipant = (conv.participants || []).some(p => p.userId === userId);
      if (!isParticipant) return res.status(403).json({ message: "Forbidden" });
      return res.status(200).json({ data: messages });
    }

    return res.status(200).json({ data: messages });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    const message = await repos.Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const conv = await repos.Conversation.findById(message.conversationId);
    const isParticipant = (conv.participants || []).some(p => p.userId === userId);
    if (!isAdmin && !isParticipant) return res.status(403).json({ message: "Forbidden" });

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

    const message = await repos.Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const isOwner = message.senderId === userId;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Only the sender or admin can update this message" });
    }

    const updated = await repos.Message.update(id, { content, isRead, isEdited, messageStatus });
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

    const message = await repos.Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const isOwner = message.senderId === userId;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Only the sender or admin can delete this message" });
    }

    await repos.Message.delete(id);
    return res.status(200).json({ message: `Message ${id} deleted` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};