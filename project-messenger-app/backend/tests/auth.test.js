import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import supertest from "supertest";
import sinon from "sinon";
import bcrypt from "bcryptjs";
import app from "../app.js";
import repos from "../repositories/index.js";
import { makeToken } from "./mocks/tokens.js";

const request = supertest(app);

const VALID_BODY = {
  username: "testuser",
  name: "Test User",
  email: "test@example.com",
  password: "Password123",
  role: "USER",
  gender: "MALE",
};

//Register 
describe("POST /api/auth/register", () => {
  afterEach(() => sinon.restore());

  it("returns 201 and a token on success", async () => {
    sinon.stub(repos.User, "findByEmail").resolves(null);
    sinon.stub(repos.User, "findByUsername").resolves(null);
    sinon.stub(repos.User, "create").resolves({
      id: "user-1",
      ...VALID_BODY,
      password: "hashed",
    });

    const res = await request.post("/api/auth/register").send(VALID_BODY);

    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.ok(res.body.user);
    assert.equal(res.body.user.email, VALID_BODY.email);
    assert.ok(!res.body.user.password, "password must not be in response");
  });

  it("returns 409 when email already exists", async () => {
    sinon.stub(repos.User, "findByEmail").resolves({ id: "existing" });
    sinon.stub(repos.User, "findByUsername").resolves(null);

    const res = await request.post("/api/auth/register").send(VALID_BODY);
    assert.equal(res.status, 409);
    assert.equal(res.body.message, "User exists");
  });

  it("returns 409 with wrong Content-Type", async () => {
    const res = await request
      .post("/api/auth/register")
      .set("Content-Type", "text/plain")
      .send("not json");

    assert.equal(res.status, 409);
    assert.ok(res.body.message.includes("application/json"));
  });
});

// Login 
describe("POST /api/auth/login", () => {
  afterEach(() => sinon.restore());

  it("returns 200 and a token with valid credentials", async () => {
    const hashed = await bcrypt.hash("Password123", 10);
    sinon.stub(repos.User, "findByEmail").resolves({
      id: "user-1",
      username: "testuser",
      email: "test@example.com",
      password: hashed,
      role: "USER",
    });

    const res = await request
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "Password123" });

    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.ok(!res.body.user.password, "password must not be in response");
  });

  it("returns 401 with wrong password", async () => {
    const hashed = await bcrypt.hash("CorrectPassword", 10);
    sinon.stub(repos.User, "findByEmail").resolves({ id: "user-1", password: hashed });

    const res = await request
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "WrongPassword" });

    assert.equal(res.status, 401);
    assert.equal(res.body.message, "Invalid credentials");
  });

  it("returns 401 when user does not exist", async () => {
    sinon.stub(repos.User, "findByEmail").resolves(null);

    const res = await request
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "Password123" });

    assert.equal(res.status, 401);
    assert.equal(res.body.message, "Invalid credentials");
  });
});

//Logout
describe("POST /api/auth/logout", () => {
  it("returns 200 with a valid token", async () => {
    const token = makeToken();
    const res = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    assert.equal(res.status, 200);
    assert.ok(res.body.message);
  });

  it("returns 401 without a token", async () => {
    const res = await request.post("/api/auth/logout").send({});
    assert.equal(res.status, 401);
  });
});