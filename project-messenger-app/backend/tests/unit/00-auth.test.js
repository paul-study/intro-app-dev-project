import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcryptjs";

import * as authController from "../../controllers/auth.js";
import repos from "../../repositories/index.js";
import { mockReq, mockRes } from "../mocks/user.mock.js";

const VALID_USER = {
  id: "user-1",
  username: "testuser",
  name: "Test User",
  email: "test@example.com",
  password: "hashed",
  role: "USER",
  gender: "MALE",
};

describe("Auth Controller", () => {
  afterEach(() => sinon.restore());

  // Register

  describe("register", () => {
    it("should return 201 and a token on success", async () => {
      sinon.stub(repos.User, "findByEmail").resolves(null);
      sinon.stub(repos.User, "findByUsername").resolves(null);
      sinon.stub(repos.User, "create").resolves(VALID_USER);

      const req = mockReq({
        username: "testuser",
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
        role: "USER",
        gender: "MALE",
      });
      const res = mockRes();

      await authController.register(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body.token).to.exist;
      expect(body.user).to.exist;
      expect(body.user.password).to.not.exist;
    });

    it("should return 409 when email already exists", async () => {
      sinon.stub(repos.User, "findByEmail").resolves(VALID_USER);
      sinon.stub(repos.User, "findByUsername").resolves(null);

      const req = mockReq({ email: "test@example.com", username: "testuser" });
      const res = mockRes();

      await authController.register(req, res);

      expect(res.status.calledWith(409)).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("User exists");
    });

    it("should return 409 when username already exists", async () => {
      sinon.stub(repos.User, "findByEmail").resolves(null);
      sinon.stub(repos.User, "findByUsername").resolves(VALID_USER);

      const req = mockReq({ email: "other@example.com", username: "testuser" });
      const res = mockRes();

      await authController.register(req, res);

      expect(res.status.calledWith(409)).to.be.true;
    });

    it("should return 500 when the repository throws", async () => {
      sinon.stub(repos.User, "findByEmail").resolves(null);
      sinon.stub(repos.User, "findByUsername").resolves(null);
      sinon.stub(repos.User, "create").rejects(new Error("DB error"));

      const req = mockReq({ username: "testuser", email: "test@example.com", password: "Password123" });
      const res = mockRes();

      await authController.register(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // Login

  describe("login", () => {
    it("should return 200 and a token with valid email and password", async () => {
      const hashed = await bcrypt.hash("Password123", 10);
      sinon.stub(repos.User, "findByEmail").resolves({ ...VALID_USER, password: hashed });

      const req = mockReq({ email: "test@example.com", password: "Password123" });
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body.token).to.exist;
      expect(body.user.password).to.not.exist;
    });

    it("should return 200 and a token with valid username and password", async () => {
      const hashed = await bcrypt.hash("Password123", 10);
      sinon.stub(repos.User, "findByEmail").resolves(null);
      sinon.stub(repos.User, "findByUsername").resolves({ ...VALID_USER, password: hashed });

      const req = mockReq({ username: "testuser", password: "Password123" });
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body.token).to.exist;
    });

    it("should return 401 when user does not exist", async () => {
      sinon.stub(repos.User, "findByEmail").resolves(null);
      sinon.stub(repos.User, "findByUsername").resolves(null);

      const req = mockReq({ email: "nobody@example.com", password: "Password123" });
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
    });

    it("should return 401 when password is wrong", async () => {
      const hashed = await bcrypt.hash("CorrectPassword", 10);
      sinon.stub(repos.User, "findByEmail").resolves({ ...VALID_USER, password: hashed });

      const req = mockReq({ email: "test@example.com", password: "WrongPassword" });
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
    });

    it("should return 500 when the repository throws", async () => {
      sinon.stub(repos.User, "findByEmail").rejects(new Error("DB error"));

      const req = mockReq({ email: "test@example.com", password: "Password123" });
      const res = mockRes();

      await authController.login(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});