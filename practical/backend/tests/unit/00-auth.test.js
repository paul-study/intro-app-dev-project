// Write your import code here
import sinon from "sinon";
import { expect } from "chai";
import { register, login } from "../../controllers/auth.js";
import authRepository from "../../repositories/auth.js";
import bcryptjs from "bcryptjs";
import { mockReq, mockRes } from "../mocks/category.mock.js";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_LIFETIME = "1h";

describe("Auth Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Register
  // -----------------------------------------------------------------------
  describe("register", () => {
    it("returns 201 and does not include a password field when the user is new", async () => {
      // Write your test code here
      const req = mockReq({ username: "kyle", password: "Password123!", role: "user" });
      const res = mockRes();

      sinon.stub(authRepository, "findByUsername").resolves(null);
      sinon.stub(bcryptjs, "genSalt").resolves("salt");
      sinon.stub(bcryptjs, "hash").resolves("hashedSecret");

      const createdUser = { id: 1, username: "kyle", role: "user" };
      sinon.stub(authRepository, "create").resolves(createdUser);

      await register(req, res);

      expect(res.status.calledOnceWithExactly(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "User successfully registered",
        data: createdUser,
      });
      expect(res.json.firstCall.args[0].data).to.not.have.property("password");
    });

    it("returns 409 when the username already exists", async () => {
      // Write your test code here
      const req = mockReq({ username: "jim", password: "Password123!", role: "user" });
      const res = mockRes();

      const existingUser = { id: 2, username: "jim", password: "hash", role: "user" };
      sinon.stub(authRepository, "findByUsername").resolves(existingUser);

      await register(req, res);

      expect(res.status.calledOnceWithExactly(409)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ message: "User already exists" });
    });
  });

  // -----------------------------------------------------------------------
  // Login
  // -----------------------------------------------------------------------
  describe("login", () => {
    it("returns 200 and a token when credentials are valid", async () => {
      // Write your test code here
      const req = mockReq({ username: "kyle", password: "Password123!" });
      const res = mockRes();

      sinon.stub(authRepository, "findByUsername").resolves({
        id: 1,
        username: "kyle",
        password: "hashed",
        role: "user",
      });
      sinon.stub(bcryptjs, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("mocked-jwt-token");

      await login(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "User successfully logged in",
        token: "mocked-jwt-token",
      });
      expect(res.json.firstCall.args[0]).to.have.property("token");
    });

    it("returns 401 when the user is not found", async () => {
      // Write your test code here
      const req = mockReq({ username: "lennard", password: "password" });
      const res = mockRes();

      sinon.stub(authRepository, "findByUsername").resolves(null);

      await login(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ message: "Invalid username" });
    });

    it("returns 401 when the password does not match", async () => {
      // Write your test code here
      const req = mockReq({ username: "alice", password: "wrongpass" });
      const res = mockRes();

      sinon.stub(authRepository, "findByUsername").resolves({
        id: 1,
        username: "alice",
        password: "hashed",
        role: "user",
      });
      sinon.stub(bcryptjs, "compare").resolves(false);

      await login(req, res);

      expect(res.status.calledOnceWithExactly(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ message: "Invalid password" });
    });
  });
});