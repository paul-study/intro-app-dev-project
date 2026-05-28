// Write your import code here
import sinon from "sinon";
import { expect } from "chai";
import { register, login } from "../../controllers/auth.js";
import prisma from "../../prisma/db.js";
import bcryptjs from "bcryptjs";
import { mockReq, mockRes } from "../mocks/category.mock.js";
import jwt from "jsonwebtoken";

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

      sinon.stub(prisma.user, "findUnique").resolves(null);
      sinon.stub(bcryptjs, "genSalt").resolves("salt");
      sinon.stub(bcryptjs, "hash").resolves("hashedSecret");

      const createdUser = { id: 1, username: "kyle", role: "user" };
      sinon.stub(prisma.user, "create").resolves(createdUser);

      await register(req, res);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body).to.have.property("message", "User successfully registered");
      expect(body).to.have.property("data");
      expect(body.data).to.deep.equal(createdUser);
      expect(body.data).to.not.have.property("password");
    });

    it("returns 409 when the username already exists", async () => {
      // Write your test code here
      const req = mockReq({ username: "jim", password: "Password123!", role: "user" });
      const res = mockRes();

      const existingUser = { id: 2, username: "jim", password: "hash", role: "user" };
      sinon.stub(prisma.user, "findUnique").resolves(existingUser);

      await register(req, res);

      expect(res.status.calledOnceWith(409)).to.be.true;
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

      const existingUser = { id: 1, username: "kyle", password: "hashed", role: "user" };
      sinon.stub(prisma.user, "findUnique").resolves(existingUser);
      sinon.stub(bcryptjs, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("mocked-jwt-token");

      await login(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ message: "Login successful", token: "mocked-jwt-token" });
    });

    it("returns 401 when the user is not found", async () => {
      // Write your test code here
      const req = mockReq({ username: "lennard", password: "password" });
      const res = mockRes();

      sinon.stub(prisma.user, "findUnique").resolves(null);

      await login(req, res);

      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ message: "Invalid username" });
    });

    it("returns 401 when the password does not match", async () => {
      // Write your test code here
      const req = mockReq({ username: "alice", password: "wrongpass" });
      const res = mockRes();

      const existingUser = { id: 1, username: "alice", password: "hashed", role: "user" };
      sinon.stub(prisma.user, "findUnique").resolves(existingUser);
      sinon.stub(bcryptjs, "compare").resolves(false);

      await login(req, res);

      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ message: "Invalid password" });
    });
  });
});