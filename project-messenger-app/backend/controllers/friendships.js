import repos from "../repositories/index.js";

export const createFriendship = async (req, res) => {
  try {
    const actorId = req.user.id;
    let { userId1, userId2, status = "PENDING", isFavorite = false } = req.body;
    userId1 = userId1 ?? actorId;
    if (!userId2) return res.status(400).json({ message: "userId2 is required" });
    if (userId1 === userId2) return res.status(400).json({ message: "Cannot friend yourself" });

    const existing = await repos.Friendship.findBetweenUsers(userId1, userId2);
    if (existing) return res.status(409).json({ message: "Friendship already exists" });

    const created = await repos.Friendship.create({ userId1, userId2, status, isFavorite });
    return res.status(201).json({ data: created });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getFriendships = async (req, res) => {
  try {
    const { userId } = req.query;
    if (req.user.role === "ADMIN" && !userId) {
      const all = await repos.Friendship.findAll();
      return res.status(200).json({ data: all });
    }
    const target = userId ?? req.user.id;
    const rows = await repos.Friendship.findByUser(target);
    return res.status(200).json({ data: rows });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getFriendship = async (req, res) => {
  try {
    const { id } = req.params;
    const f = await repos.Friendship.findById(id);
    if (!f) return res.status(404).json({ message: "Not found" });
    const userId = req.user.id;
    const isParticipant = f.userId1 === userId || f.userId2 === userId;
    if (!isParticipant && req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });
    return res.status(200).json({ data: f });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateFriendship = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = {};
    if (req.body.status) fields.status = req.body.status;
    if (typeof req.body.isFavorite === "boolean") fields.isFavorite = req.body.isFavorite;

    const f = await repos.Friendship.findById(id);
    if (!f) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;
    const isParticipant = f.userId1 === userId || f.userId2 === userId;
    if (!isParticipant && req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

    const updated = await repos.Friendship.update(id, fields);
    return res.status(200).json({ data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteFriendship = async (req, res) => {
  try {
    const { id } = req.params;
    const f = await repos.Friendship.findById(id);
    if (!f) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;
    const isParticipant = f.userId1 === userId || f.userId2 === userId;
    if (!isParticipant && req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

    await repos.Friendship.delete(id);
    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};