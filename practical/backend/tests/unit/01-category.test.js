// Write your import code here
import sinon from "sinon";
import { expect } from "chai";
import {
  createCategories,
  getCategories,
  getCategory,
  deleteCategory,
} from "../../controllers/category.js";
import categoryRepository from "../../repositories/category.js";
import { mockReq, mockRes } from "../mocks/category.mock.js";


describe("Category Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  describe("createCategories", () => {
    it("returns 201 and the new categories when the repository resolves successfully", async () => {
      // Write your test code here
      const req = mockReq();
      const res = mockRes();

      const trivia = [{ id: 9, name: "General Knowledge" }];
      const expectedCategories = [{ id: 9, name: "General Knowledge" }];

      sinon.stub(global, "fetch").resolves({
        json: sinon.stub().resolves({ trivia_categories: trivia }),
      });

      sinon.stub(categoryRepository, "createMany").resolves(expectedCategories);

      await createCategories(req, res);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "Categories successfully created",
        data: expectedCategories,

      });
    });
  });

  // -----------------------------------------------------------------------
  // Read all
  // -----------------------------------------------------------------------
  describe("getCategories", () => {
    it("returns 200 and an array of categories when categories exist", async () => {
      // Write your test code here
      const req = mockReq();
      const res = mockRes();

      const categories = [{ id: 1, name: "General Knowledge" }];
      sinon.stub(categoryRepository, "findAll").resolves(categories);

      await getCategories(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        data: categories,
      });
    });

    it("returns 404 when no categories exist", async () => {
      // Write your test code here
      const req = mockReq();
      const res = mockRes();

      sinon.stub(categoryRepository, "findAll").resolves(null);

      await getCategories(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "No categories found",
      });
    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getCategory", () => {
    it("returns 200 and the category when it is found", async () => {
      // Write your test code here
      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      const category = { id: 1, name: "General Knowledge" };
      sinon.stub(categoryRepository, "findById").resolves(category);

      await getCategory(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        data: category,
      });
    });

    it("returns 404 when the category is not found", async () => {
      // Write your test code here
      const req = mockReq({}, { id: "999" });
      const res = mockRes();

      sinon.stub(categoryRepository, "findById").resolves(null);

      await getCategory(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "No category with the id: 999 found",
      });
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteCategory", () => {
    it("returns 200 when the category is found and deleted", async () => {
      // Write your test code here
      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      const category = { id: 1, name: "General Knowledge" };
      sinon.stub(categoryRepository, "findById").resolves(category);
      sinon.stub(categoryRepository, "delete").resolves();

      await deleteCategory(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "Category with the id: 1 successfully deleted",
      });
    });

    it("returns 404 when the category to delete is not found", async () => {
      // Write your test code here
      const req = mockReq({}, { id: "999" });
      const res = mockRes();

      sinon.stub(categoryRepository, "findById").resolves(null);

      await deleteCategory(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "No category with the id: 999 found",
      });
    });
  });
});
