import { expect } from "chai";
import sinon from "sinon";

import { authorize, ownerOrAdmin } from "../../middleware/rbac.js";

const mockNext = () => sinon.stub();

const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

describe("authorize Middleware", () => {
  it("should return 401 when req.user is undefined", () => {
    const req = {};
    const res = mockRes();
    const next = mockNext();

    authorize(["USER"])(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should return 403 when user role is not in the allowed list", () => {
    const req = { user: { role: "USER" } };
    const res = mockRes();
    const next = mockNext();

    authorize(["ADMIN"])(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should call next() when user role is in the allowed list", () => {
    const req = { user: { role: "ADMIN" } };
    const res = mockRes();
    const next = mockNext();

    authorize(["ADMIN"])(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it("should call next() when allowed roles array contains multiple roles and user matches one", () => {
    const req = { user: { role: "USER" } };
    const res = mockRes();
    const next = mockNext();

    authorize(["USER", "ADMIN"])(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it("should call next() when no roles are specified (open route)", () => {
    const req = { user: { role: "USER" } };
    const res = mockRes();
    const next = mockNext();

    authorize([])(req, res, next);

    expect(next.calledOnce).to.be.true;
  });
});

describe("ownerOrAdmin Middleware", () => {
  it("should return 401 when req.user is undefined", () => {
    const req = { params: { id: "user-1" } };
    const res = mockRes();
    const next = mockNext();

    ownerOrAdmin("id")(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should call next() when user is ADMIN", () => {
    const req = { user: { id: "admin-1", role: "ADMIN" }, params: { id: "user-1" } };
    const res = mockRes();
    const next = mockNext();

    ownerOrAdmin("id")(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it("should call next() when user id matches the param id", () => {
    const req = { user: { id: "user-1", role: "USER" }, params: { id: "user-1" } };
    const res = mockRes();
    const next = mockNext();

    ownerOrAdmin("id")(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it("should return 403 when user is not the owner and not ADMIN", () => {
    const req = { user: { id: "user-2", role: "USER" }, params: { id: "user-1" } };
    const res = mockRes();
    const next = mockNext();

    ownerOrAdmin("id")(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(next.called).to.be.false;
  });
});