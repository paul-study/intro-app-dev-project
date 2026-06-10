import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import supertest from "supertest";
import sinon from "sinon";
import app from "../app.js";
import repos from "../repositories/index.js";
import { adminToken, userToken } from "./mocks/tokens.js";
import { clearCacheStore } from "../middleware/cache.js";

const request = supertest(app);

const MOCK_USER = {
  id: "user-1",
  username: "testuser",
  name: "Test User",
  email: "test@example.com",
  password: "hashed",
  role: "USER",
  gender: "MALE",
};

const VALID_BODY = {
  username: "newuser",
  name: "New User",
  email: "new@example.com",
  password: "Password123",
  gender: "MALE",
};

describe("GET /api/users", () => {
  afterEach(() => {
    sinon.restore();
    clearCacheStore();
  });

  it("returns 200 with user list for ADMIN", async () => {
    sinon.stub(repos.User, "findAll").resolves([MOCK_USER]);

    const res = await request
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.data.length, 1);
  });

  it("returns 404 when no users exist", async () => {
    sinon.stub(repos.User, "findAll").resolves([]);

    const res = await request
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "No users found");
  });

  it("returns 403 for USER role (not ADMIN)", async () => {
    const res = await request
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);

    assert.equal(res.status, 403);
    assert.equal(res.body.message, "Forbidden");
  });

  it("returns 401 with no token", async () => {
    const res = await request.get("/api/users");
    assert.equal(res.status, 401);
  });

  it("filtering: passes role filter to findAll", async () => {
    const stub = sinon.stub(repos.User, "findAll").resolves([MOCK_USER]);

    await request
      .get("/api/users?role=USER")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.ok(stub.calledOnce);
    const [args] = stub.firstCall.args;
    assert.deepEqual(args.where, { role: "USER" });
  });

  it("sorting: passes sort and order to findAll", async () => {
    const stub = sinon.stub(repos.User, "findAll").resolves([MOCK_USER]);

    await request
      .get("/api/users?sort=username&order=desc")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.ok(stub.calledOnce);
    const [args] = stub.firstCall.args;
    assert.deepEqual(args.orderBy, { username: "desc" });
  });

  it("pagination: passes skip and take to findAll", async () => {
    const stub = sinon.stub(repos.User, "findAll").resolves([MOCK_USER]);

    await request
      .get("/api/users?page=2&limit=5")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.ok(stub.calledOnce);
    const [args] = stub.firstCall.args;
    assert.equal(args.skip, 5);
    assert.equal(args.take, 5);
  });
});

describe("GET /api/users/:id", () => {
  afterEach(() => {
    sinon.restore();
    clearCacheStore();
  });

  it("returns 200 for the owner of the account", async () => {
    sinon.stub(repos.User, "findById").resolves(MOCK_USER);

    const res = await request
      .get("/api/users/user-1")
      .set("Authorization", `Bearer ${userToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.id, "user-1");
  });

  it("returns 200 for ADMIN accessing any user", async () => {
    sinon.stub(repos.User, "findById").resolves(MOCK_USER);

    const res = await request
      .get("/api/users/user-1")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
  });

  it("returns 403 when USER accesses another user's profile", async () => {
    const res = await request
      .get("/api/users/user-999")
      .set("Authorization", `Bearer ${userToken}`);

    assert.equal(res.status, 403);
    assert.equal(res.body.message, "Forbidden");
  });

  it("returns 404 when user does not exist", async () => {
    sinon.stub(repos.User, "findById").resolves(null);

    const res = await request
      .get("/api/users/user-1")
      .set("Authorization", `Bearer ${userToken}`);

    assert.equal(res.status, 404);
  });

  it("returns 401 with no token", async () => {
    const res = await request.get("/api/users/user-1");
    assert.equal(res.status, 401);
  });
});

describe("POST /api/users", () => {
  afterEach(() => {
    sinon.restore();
    clearCacheStore();
  });

  it("returns 201 on successful creation", async () => {
    sinon.stub(repos.User, "create").resolves({ id: "new-id", ...VALID_BODY });

    const res = await request
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(VALID_BODY);

    assert.equal(res.status, 201);
    assert.equal(res.body.message, "User successfully created");
    assert.ok(res.body.data);
  });

  it("Joi validation: returns 409 when required fields are missing", async () => {
    const res = await request
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ username: "x" });

    assert.equal(res.status, 409);
    assert.ok(Array.isArray(res.body.errors));
    assert.ok(res.body.errors.length > 0);
  });

  it("Joi validation: returns 409 for invalid email format", async () => {
    const res = await request
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...VALID_BODY, email: "not-an-email" });

    assert.equal(res.status, 409);
    assert.ok(res.body.errors.some((e) => e.type.includes("email")));
  });

  it("Joi validation: returns 409 when password is too short", async () => {
    const res = await request
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...VALID_BODY, password: "short" });

    assert.equal(res.status, 409);
    assert.ok(res.body.errors.some((e) => e.type === "string.min"));
  });

  it("Joi validation: returns 409 for invalid gender value", async () => {
    const res = await request
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...VALID_BODY, gender: "ALIEN" });

    assert.equal(res.status, 409);
    assert.ok(res.body.errors.some((e) => e.type === "any.only"));
  });

  it("returns 409 with wrong Content-Type", async () => {
    const res = await request
      .post("/api/users")
      .set("Content-Type", "text/plain")
      .set("Authorization", `Bearer ${adminToken}`)
      .send("bad body");

    assert.equal(res.status, 409);
    assert.ok(res.body.message.includes("application/json"));
  });

  it("returns 401 with no token", async () => {
    const res = await request.post("/api/users").send(VALID_BODY);
    assert.equal(res.status, 401);
  });
});

describe("PUT /api/users/:id", () => {
  afterEach(() => {
    sinon.restore();
    clearCacheStore();
  });

  it("returns 200 when owner updates their own account", async () => {
    sinon.stub(repos.User, "findById").resolves(MOCK_USER);
    sinon.stub(repos.User, "update").resolves({ ...MOCK_USER, name: "Updated" });

    const res = await request
      .put("/api/users/user-1")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated" });

    assert.equal(res.status, 200);
    assert.ok(res.body.message.includes("updated"));
  });

  it("returns 404 when the user does not exist", async () => {
    sinon.stub(repos.User, "findById").resolves(null);

    const res = await request
      .put("/api/users/user-1")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated" });

    assert.equal(res.status, 404);
  });

  it("returns 403 when USER updates another user's account", async () => {
    const res = await request
      .put("/api/users/user-999")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Hacker" });

    assert.equal(res.status, 403);
  });

  it("returns 400 when id is missing from the URL", async () => {
    const res = await request
      .put("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Test" });

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes("id is required"));
  });

  it("returns 401 with no token", async () => {
    const res = await request.put("/api/users/user-1").send({ name: "Test" });
    assert.equal(res.status, 401);
  });
});

describe("DELETE /api/users/:id", () => {
  afterEach(() => {
    sinon.restore();
    clearCacheStore();
  });

  it("returns 200 when ADMIN deletes a user", async () => {
    sinon.stub(repos.User, "findById").resolves(MOCK_USER);
    sinon.stub(repos.User, "delete").resolves();

    const res = await request
      .delete("/api/users/user-1")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
    assert.ok(res.body.message.includes("deleted"));
  });

  it("returns 404 when user does not exist", async () => {
    sinon.stub(repos.User, "findById").resolves(null);

    const res = await request
      .delete("/api/users/user-1")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.equal(res.status, 404);
  });

  it("returns 403 when USER role tries to delete", async () => {
    const res = await request
      .delete("/api/users/user-1")
      .set("Authorization", `Bearer ${userToken}`);

    assert.equal(res.status, 403);
    assert.equal(res.body.message, "Forbidden");
  });

  it("returns 400 when id is missing from the URL", async () => {
    const res = await request
      .delete("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes("id is required"));
  });

  it("returns 401 with no token", async () => {
    const res = await request.delete("/api/users/user-1");
    assert.equal(res.status, 401);
  });
});