import jwt from "jsonwebtoken";

const SECRET =
  process.env.JWT_SECRET || "MySuperSecretKeyChangeInProduction256Bits";

export const makeToken = (overrides = {}) =>
  jwt.sign(
    { id: "user-1", username: "testuser", role: "USER", ...overrides },
    SECRET
  );

export const adminToken = makeToken({ id: "admin-1", role: "ADMIN" });
export const userToken  = makeToken({ id: "user-1",  role: "USER"  });