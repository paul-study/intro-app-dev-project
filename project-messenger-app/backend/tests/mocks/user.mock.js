import sinon from "sinon";
import repos from "../../repositories/index.js";

export const mockReq = (body = {}, params = {}, query = {}) => ({
  body, params, query,
});

export const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

export const stubUserRepo = () => ({
  create:          sinon.stub(repos.User, "create"),
  findAll:         sinon.stub(repos.User, "findAll"),
  findById:        sinon.stub(repos.User, "findById"),
  findByEmail:     sinon.stub(repos.User, "findByEmail"),
  findByUsername:  sinon.stub(repos.User, "findByUsername"),
  update:          sinon.stub(repos.User, "update"),
  delete:          sinon.stub(repos.User, "delete"),
});