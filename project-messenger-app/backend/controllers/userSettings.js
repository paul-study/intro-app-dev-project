import repos from "../repositories/index.js";

export const createUserSettings = async (req, res) => {
  try {
    const payload = req.body;
    const actorId = req.user.id;
    const actorRole = req.user.role;

    const userId = payload.userId ?? actorId;
    if (payload.userId && payload.userId !== actorId && actorRole !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const existing = await repos.UserSettings.findByUserId(userId);
    if (existing) return res.status(409).json({ message: "Settings already exist for this user" });

    const data = { ...payload, userId };
    const created = await repos.UserSettings.create(data);
    return res.status(201).json({ data: created });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserSettingsList = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });
    const rows = await repos.UserSettings.findAll();
    return res.status(200).json({ data: rows });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserSettingsById = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await repos.UserSettings.findById(id);
    if (!settings) return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "ADMIN" && settings.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ data: settings });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await repos.UserSettings.findById(id);
    if (!settings) return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "ADMIN" && settings.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await repos.UserSettings.update(id, req.body);
    return res.status(200).json({ data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteUserSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await repos.UserSettings.findById(id);
    if (!settings) return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "ADMIN" && settings.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await repos.UserSettings.delete(id);
    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};