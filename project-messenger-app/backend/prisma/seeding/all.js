import bcrypt from "bcryptjs";
import prisma from "../db.js";

async function main() {
  await prisma.message.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("P@ssw0rd", 10);

  const users = await Promise.all(
    [
      { username: "admin1", name: "Admin One", email: "admin1@example.com", role: "ADMIN", gender: "MALE" },
      { username: "user2", name: "User Two", email: "user2@example.com", role: "USER", gender: "FEMALE" },
      { username: "user3", name: "User Three", email: "user3@example.com", role: "USER", gender: "UNKNOWN" },
      { username: "user4", name: "User Four", email: "user4@example.com", role: "USER", gender: "MALE" },
      { username: "user5", name: "User Five", email: "user5@example.com", role: "USER", gender: "FEMALE" },
    ].map((user) =>
      prisma.user.create({
        data: {
          ...user,
          password: passwordHash,
        },
      })
    )
  );

  await Promise.all(
    users.map((user, index) =>
      prisma.userSettings.create({
        data: {
          userId: user.id,
          themeColor: ["#0f62fe", "#198038", "#a56eff", "#ff832b", "#da1e28"][index],
          timeZone: "UTC",
          language: "en",
          notificationsEnabled: true,
          statusMessage: `Status for ${user.username}`,
          profileImage: `https://example.com/avatar-${index + 1}.png`,
        },
      })
    )
  );

  const conversations = await Promise.all(
    users.map((user, index) =>
      prisma.conversation.create({
        data: {
          title: `Conversation ${index + 1}`,
          isGroup: index % 2 === 0,
          chatType: index % 2 === 0 ? "GROUP" : "DIRECT",
          creatorId: user.id,
        },
      })
    )
  );

  await Promise.all(
    conversations.map((conversation, index) =>
      prisma.conversationParticipant.create({
        data: {
          conversationId: conversation.id,
          userId: users[index].id,
          participantRole: "ADMIN",
          isMuted: false,
          nickname: `creator-${index + 1}`,
        },
      })
    )
  );

  await Promise.all(
    conversations.map((conversation, index) =>
      prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: users[index].id,
          content: `Seed message ${index + 1}`,
          isRead: false,
          isEdited: false,
          messageStatus: "SENT",
        },
      })
    )
  );

  await Promise.all(
    [
      [users[0].id, users[1].id],
      [users[1].id, users[2].id],
      [users[2].id, users[3].id],
      [users[3].id, users[4].id],
      [users[4].id, users[0].id],
    ].map(([userId1, userId2], index) =>
      prisma.friendship.create({
        data: {
          userId1,
          userId2,
          status: ["PENDING", "ACCEPTED", "BLOCKED", "PENDING", "ACCEPTED"][index],
          isFavorite: index % 2 === 0,
        },
      })
    )
  );

  console.log("Seeded 5 records per model successfully");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });