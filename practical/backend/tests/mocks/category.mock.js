import sinon from "sinon";
import categoryRepository from "../../repositories/category.js";

export const mockReq = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

export const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

export const stubCategoryRepo = () => ({
  createMany: sinon.stub(categoryRepository, "createMany"),
  findAll: sinon.stub(categoryRepository, "findAll"),
  findById: sinon.stub(categoryRepository, "findById"),
  delete: sinon.stub(categoryRepository, "delete"),
});