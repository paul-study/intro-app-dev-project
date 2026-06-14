import { expect } from "chai";
import sinon from "sinon";

import * as userController from "../../controllers/user.js";
import repos from "../../repositories/index.js";
import { mockReq, mockRes } from "../mocks/user.mock.js";

const MOCK_USER = {
  id: "user-1",
  username: "testuser",
  name: "Test User",
  email: "test@example.com",
  password: "hashed",
  role: "USER",
  gender: "MALE",
};

describe("User Controller", () => {
  afterEach(() => sinon.restore());

  // Create

  describe("createUser", () => {
    it("should return 201 and the created user", async () => {
      sinon.stub(repos.User, "create").resolves(MOCK_USER);

      const req = mockReq({
        username: "testuser",
        name: "Test User",
        email: "test@example.com",
        password: "hashed",
        role: "USER",
        gender: "MALE",
      });
      const res = mockRes();

      await userController.createUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body.data.username).to.equal("testuser");
    });

    it("should return 500 when the repository throws", async () => {
      sinon.stub(repos.User, "create").rejects(new Error("DB error"));

      const req = mockReq({ username: "testuser", email: "test@example.com" });
      const res = mockRes();

      await userController.createUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // Read all

  describe("getUsers", () => {
    it("should return 200 and all users", async () => {
      sinon.stub(repos.User, "findAll").resolves([MOCK_USER]);

      const req = mockReq({}, {}, {});
      const res = mockRes();

      await userController.getUsers(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body.data).to.have.length(1);
    });

    it("should return 404 when no users exist", async () => {
      sinon.stub(repos.User, "findAll").resolves([]);

      const req = mockReq({}, {}, {});
      const res = mockRes();

      await userController.getUsers(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 500 when the repository throws", async () => {
      sinon.stub(repos.User, "findAll").rejects(new Error("DB error"));

      const req = mockReq({}, {}, {});
      const res = mockRes();

      await userController.getUsers(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // Read one

  describe("getUser", () => {
    it("should return 200 and the matching user", async () => {
      sinon.stub(repos.User, "findById").resolves(MOCK_USER);

      const req = mockReq({}, { id: "user-1" });
      const res = mockRes();

      await userController.getUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body.data.id).to.equal("user-1");
    });

    it("should return 404 when user does not exist", async () => {
      sinon.stub(repos.User, "findById").resolves(null);

      const req = mockReq({}, { id: "does-not-exist" });
      const res = mockRes();

      await userController.getUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 500 when the repository throws", async () => {
      sinon.stub(repos.User, "findById").rejects(new Error("DB error"));

      const req = mockReq({}, { id: "user-1" });
      const res = mockRes();

      await userController.getUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // Update

  describe("updateUser", () => {
    it("should return 200 and the updated user", async () => {
      const updated = { ...MOCK_USER, name: "Updated Name" };
      sinon.stub(repos.User, "findById").resolves(MOCK_USER);
      sinon.stub(repos.User, "update").resolves(updated);

      const req = mockReq({ name: "Updated Name" }, { id: "user-1" });
      const res = mockRes();

      await userController.updateUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      const body = res.json.firstCall.args[0];
      expect(body.data.name).to.equal("Updated Name");
    });

    it("should return 404 when user does not exist", async () => {
      sinon.stub(repos.User, "findById").resolves(null);

      const req = mockReq({ name: "Updated Name" }, { id: "does-not-exist" });
      const res = mockRes();

      await userController.updateUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 500 when the repository throws", async () => {
      sinon.stub(repos.User, "findById").rejects(new Error("DB error"));

      const req = mockReq({ name: "Updated Name" }, { id: "user-1" });
      const res = mockRes();

      await userController.updateUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // Delete

  describe("deleteUser", () => {
    it("should return 200 and a success message", async () => {
      sinon.stub(repos.User, "findById").resolves(MOCK_USER);
      sinon.stub(repos.User, "delete").resolves();

      const req = mockReq({}, { id: "user-1" });
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should return 404 when user does not exist", async () => {
      sinon.stub(repos.User, "findById").resolves(null);

      const req = mockReq({}, { id: "does-not-exist" });
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 500 when the repository throws", async () => {
      sinon.stub(repos.User, "findById").rejects(new Error("DB error"));

      const req = mockReq({}, { id: "user-1" });
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});