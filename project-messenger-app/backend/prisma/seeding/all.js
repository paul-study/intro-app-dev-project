import bcrypt from "bcryptjs";
import prisma from "../db.js";

async function main() {
  // Clear in dependency order
  await prisma.message.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("P@ssw0rd", 10);

  // --- Users ---
  const [admin1, user2, user3, user4, user5] = await Promise.all(
    [
      { username: "admin1", name: "Admin One",   email: "admin1@example.com", role: "ADMIN", gender: "MALE"    },
      { username: "user2",  name: "User Two",    email: "user2@example.com",  role: "USER",  gender: "FEMALE"  },
      { username: "user3",  name: "User Three",  email: "user3@example.com",  role: "USER",  gender: "UNKNOWN" },
      { username: "user4",  name: "User Four",   email: "user4@example.com",  role: "USER",  gender: "MALE"    },
      { username: "user5",  name: "User Five",   email: "user5@example.com",  role: "USER",  gender: "FEMALE"  },
    ].map((u) => prisma.user.create({ data: { ...u, password: passwordHash } }))
  );
  const users = [admin1, user2, user3, user4, user5];

  // --- UserSettings ---
  await Promise.all(
    users.map((user, i) =>
      prisma.userSettings.create({
        data: {
          userId: user.id,
          themeColor: ["#0f62fe", "#198038", "#a56eff", "#ff832b", "#da1e28"][i],
          timeZone: "UTC",
          language: "en",
          notificationsEnabled: true,
          statusMessage: `Status for ${user.username}`,
          profileImage: `https://example.com/avatar-${i + 1}.png`,
        },
      })
    )
  );

  // --- Conversations ---
  // DIRECT conversations have creator + one other participant.
  // GROUP conversations have creator + two other participants.
  const convDefs = [
    // [creator, chatType, title, ...extraParticipants]
    { creator: admin1, chatType: "GROUP",  title: "Group Chat Alpha",   extras: [user2, user3] },
    { creator: user2,  chatType: "DIRECT", title: "user2 & user3",      extras: [user3]        },
    { creator: user3,  chatType: "GROUP",  title: "Group Chat Beta",    extras: [user4, user5] },
    { creator: user4,  chatType: "DIRECT", title: "user4 & user5",      extras: [user5]        },
    { creator: user5,  chatType: "DIRECT", title: "user5 & admin1",     extras: [admin1]       },
  ];

  const conversations = await Promise.all(
    convDefs.map(({ creator, chatType, title, extras }) =>
      prisma.conversation.create({
        data: {
          title,
          isGroup: chatType === "GROUP",
          chatType,
          creator: { connect: { id: creator.id } },
          participants: {
            create: [
              { user: { connect: { id: creator.id } }, participantRole: "ADMIN" },
              ...extras.map((u) => ({ user: { connect: { id: u.id } }, participantRole: "USER" })),
            ],
          },
        },
      })
    )
  );

  // --- Messages (2 per conversation, from different participants) ---
  const messagePairs = [
    [admin1, user2],
    [user2,  user3],
    [user3,  user4],
    [user4,  user5],
    [user5,  admin1],
  ];
  await Promise.all(
    conversations.flatMap((conv, i) => {
      const [senderA, senderB] = messagePairs[i];
      return [
        prisma.message.create({
          data: { conversationId: conv.id, senderId: senderA.id, content: `Hey there! (seed ${i + 1}a)`, messageStatus: "SENT" },
        }),
        prisma.message.create({
          data: { conversationId: conv.id, senderId: senderB.id, content: `Hi! How are you? (seed ${i + 1}b)`, messageStatus: "SENT" },
        }),
      ];
    })
  );

  // --- Friendships ---
  await Promise.all(
    [
      { userId1: admin1.id, userId2: user2.id,  status: "ACCEPTED", isFavorite: true  },
      { userId1: user2.id,  userId2: user3.id,  status: "ACCEPTED", isFavorite: false },
      { userId1: user3.id,  userId2: user4.id,  status: "PENDING",  isFavorite: false },
      { userId1: user4.id,  userId2: user5.id,  status: "BLOCKED",  isFavorite: false },
      { userId1: user5.id,  userId2: admin1.id, status: "ACCEPTED", isFavorite: true  },
    ].map((f) => prisma.friendship.create({ data: f }))
  );

  console.log("Seeded successfully: 5 users, 5 conversations (with participants), 10 messages, 5 friendships");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });