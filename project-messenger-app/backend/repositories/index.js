import prisma from "../prisma/db.js";

const User = {
  create: (data) => prisma.user.create({ data }),
  findAll: ({ where = {}, take, skip, orderBy } = {}) =>
  prisma.user.findMany({
    where,
    ...(take !== undefined ? { take } : {}),
    ...(skip !== undefined ? { skip } : {}),
    ...(orderBy ? { orderBy } : {}),
  }),
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  findByUsername: (username) => prisma.user.findUnique({ where: { username } }),
  update: (id, data) => prisma.user.update({ where: { id }, data }),
  delete: (id) => prisma.user.delete({ where: { id } }),
};

const UserSettings = {
  create: (data) => prisma.userSettings.create({ data }),
  findAll: () => prisma.userSettings.findMany(),
  findById: (id) => prisma.userSettings.findUnique({ where: { id } }),
  findByUserId: (userId) => prisma.userSettings.findUnique({ where: { userId } }),
  update: (id, data) => prisma.userSettings.update({ where: { id }, data }),
  updateByUserId: (userId, data) => prisma.userSettings.update({ where: { userId }, data }),
  delete: (id) => prisma.userSettings.delete({ where: { id } }),
};

const Conversation = {
  create: (data) => prisma.conversation.create({ data }),
  findAll: (filter = {}) => prisma.conversation.findMany({ where: filter }),
  findById: (id) => prisma.conversation.findUnique({ where: { id } }),
  update: (id, data) => prisma.conversation.update({ where: { id }, data }),
  delete: (id) => prisma.conversation.delete({ where: { id } }),
  findByUserId: (userId) =>
    prisma.conversation.findMany({ where: { participants: { some: { userId } } } }),
};

const Message = {
  create: (data) => prisma.message.create({ data }),
  findAll: (filter = {}) => prisma.message.findMany({ where: filter, orderBy: { timestamp: "asc" } }),
  findById: (id) => prisma.message.findUnique({ where: { id } }),
  update: (id, data) => prisma.message.update({ where: { id }, data }),
  delete: (id) => prisma.message.delete({ where: { id } }),
  findByConversationId: (conversationId, opts = {}) =>
    prisma.message.findMany({ where: { conversationId }, orderBy: { timestamp: "asc" }, ...opts }),
};

const ConversationParticipant = {
  create: (data) => prisma.conversationParticipant.create({ data }),
  findAll: (filter = {}) => prisma.conversationParticipant.findMany({ where: filter }),
  findById: (id) => prisma.conversationParticipant.findUnique({ where: { id } }),
  update: (id, data) => prisma.conversationParticipant.update({ where: { id }, data }),
  delete: (id) => prisma.conversationParticipant.delete({ where: { id } }),
  findByConversationId: (conversationId) =>
    prisma.conversationParticipant.findMany({ where: { conversationId } }),
  findByUserAndConversation: (userId, conversationId) =>
    prisma.conversationParticipant.findFirst({ where: { userId, conversationId } }),
};

const Friendship = {
  create: (data) => prisma.friendship.create({ data }),
  findAll: (filter = {}) => prisma.friendship.findMany({ where: filter }),
  findById: (id) => prisma.friendship.findUnique({ where: { id } }),
  update: (id, data) => prisma.friendship.update({ where: { id }, data }),
  delete: (id) => prisma.friendship.delete({ where: { id } }),
  findByUser: (userId) =>
    prisma.friendship.findMany({ where: { OR: [{ userId1: userId }, { userId2: userId }] } }),
  findBetweenUsers: (a, b) =>
    prisma.friendship.findFirst({
      where: { OR: [{ userId1: a, userId2: b }, { userId1: b, userId2: a }] },
    }),
};

export default {
  User,
  UserSettings,
  Conversation,
  Message,
  ConversationParticipant,
  Friendship,
};