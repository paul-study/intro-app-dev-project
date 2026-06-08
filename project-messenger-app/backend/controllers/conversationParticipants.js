import repos from "../repositories/index.js";

const isConvAdmin = (conv, userId, userRole) => {
  if (userRole === "ADMIN") return true;
  const participant = conv.participants?.find(p => p.userId === userId);
  return participant?.participantRole === "ADMIN" || conv.creatorId === userId;
};

export const createParticipant = async (req, res) => {
  try {
    const { conversationId, userId, participantRole = "USER", nickname } = req.body;
    const actorId = req.user.id;
    const actorRole = req.user.role;

    const conv = await repos.Conversation.findById(conversationId);
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    if (!isConvAdmin(conv, actorId, actorRole)) {
      return res.status(403).json({ message: "Only conversation admins/creator or global admin can add participants" });
    }

    const existing = await repos.ConversationParticipant.findByUserAndConversation(userId, conversationId);
    if (existing) return res.status(409).json({ message: "User is already a participant" });

    const participant = await repos.ConversationParticipant.create({
      conversationId,
      userId,
      participantRole,
      nickname,
    });

    return res.status(201).json({ data: participant });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getParticipants = async (req, res) => {
  try {
    const { conversationId } = req.query;
    const where = conversationId ? { conversationId } : {};
    const participants = await repos.ConversationParticipant.findAll(where);
    return res.status(200).json({ data: participants });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await repos.ConversationParticipant.findById(id);
    if (!p) return res.status(404).json({ message: "Participant not found" });

    const conv = await repos.Conversation.findById(p.conversationId);
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    const isParticipant = (conv.participants || []).some(pt => pt.userId === userId);
    if (!isAdmin && !isParticipant) return res.status(403).json({ message: "Forbidden" });

    return res.status(200).json({ data: p });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantRole, isMuted, nickname } = req.body;
    const actorId = req.user.id;
    const actorRole = req.user.role;

    const p = await repos.ConversationParticipant.findById(id);
    if (!p) return res.status(404).json({ message: "Participant not found" });

    const conv = await repos.Conversation.findById(p.conversationId);
    if (!(actorRole === "ADMIN" || isConvAdmin(conv, actorId, actorRole) || actorId === p.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await repos.ConversationParticipant.update(id, { participantRole, isMuted, nickname });
    return res.status(200).json({ data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const actorId = req.user.id;
    const actorRole = req.user.role;

    const p = await repos.ConversationParticipant.findById(id);
    if (!p) return res.status(404).json({ message: "Participant not found" });

    const conv = await repos.Conversation.findById(p.conversationId);
    const actorIsConvAdmin = isConvAdmin(conv, actorId, actorRole);

    // allow participant to leave (delete self) or admins to remove
    if (!(actorIsConvAdmin || actorId === p.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await repos.ConversationParticipant.delete(id);
    return res.status(200).json({ message: "Participant removed" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};