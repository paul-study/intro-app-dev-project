import repos from "../repositories/index.js";

export const createConversation = async (req, res) => {
  try {
    const { title, isGroup = false, chatType = "DIRECT", userId2 } = req.body;
    const creatorId = req.user.id;

    const participantsCreate = [
      { user: { connect: { id: creatorId } }, participantRole: "ADMIN" },
    ];
    if (userId2 && userId2 !== creatorId) {
      participantsCreate.push({
        user: { connect: { id: userId2 } },
        participantRole: "USER",
      });
    }

    const conversation = await repos.Conversation.create({
      title,
      isGroup,
      chatType,
      creator: { connect: { id: creatorId } },
      participants: { create: participantsCreate },
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

    const conversations = await repos.Conversation.findAll(isAdmin ? {} : { participants: { some: { userId } } });
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

    const conversation = await repos.Conversation.findById(id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const isParticipant = (conversation.participants || []).some((p) => p.userId === userId);
    if (!isAdmin && !isParticipant) return res.status(403).json({ message: "Forbidden" });

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

    const conversation = await repos.Conversation.findById(id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    if (!isAdmin && conversation.creatorId !== userId) {
      return res.status(403).json({ message: "Only the creator or admin can update this conversation" });
    }

    const updated = await repos.Conversation.update(id, { title, isGroup, chatType });
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

    const conversation = await repos.Conversation.findById(id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    if (!isAdmin && conversation.creatorId !== userId) {
      return res.status(403).json({ message: "Only the creator or admin can delete this conversation" });
    }

    await repos.Conversation.delete(id);
    return res.status(200).json({ message: `Conversation ${id} deleted` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};