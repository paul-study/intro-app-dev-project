import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";

import jwtAuth from "../../middleware/jwtAuth.js";
import { mockReq, mockRes } from "../mocks/user.mock.js";

const SECRET = process.env.JWT_SECRET || "MySuperSecretKeyChangeInProduction256Bits";

const mockNext = () => sinon.stub();

describe("jwtAuth Middleware", () => {
  afterEach(() => sinon.restore());

  it("should return 401 when no Authorization header is present", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = mockNext();

    jwtAuth(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should return 401 when header does not start with Bearer", () => {
    const req = { headers: { authorization: "Token abc123" } };
    const res = mockRes();
    const next = mockNext();

    jwtAuth(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should call next() and set req.user when token is valid", () => {
    const token = jwt.sign({ id: "user-1", username: "testuser", role: "USER" }, SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = mockNext();

    jwtAuth(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(req.user).to.exist;
    expect(req.user.id).to.equal("user-1");
  });

  it("should return 401 when token is expired", () => {
    const token = jwt.sign({ id: "user-1", role: "USER" }, SECRET, { expiresIn: -1 });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = mockNext();

    jwtAuth(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should return 401 when token is tampered", () => {
    const req = { headers: { authorization: "Bearer totally.fake.token" } };
    const res = mockRes();
    const next = mockNext();

    jwtAuth(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });
});