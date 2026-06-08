// Write your import code here
import sinon from "sinon";
import { expect } from "chai";
import { createQuiz, getQuizzes, getQuiz, updateQuiz, deleteQuiz } from "../../controllers/quiz.js";
import quizRepository from "../../repositories/quiz.js";
import categoryRepository from "../../repositories/category.js";
import questionRepository from "../../repositories/question.js";
import { mockReq, mockRes, stubQuizRepo } from "../mocks/quiz.mock.js";

describe("Quiz Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  describe("createQuiz", () => {
    it("returns 201 and the new quiz when the category exists and the repository resolves successfully", async () => {
      // Write your test code here
      const req = mockReq({
        title: "Sample Quiz",
        categoryId: 1,
        amount: 2,
        difficulty: "medium",
        type: "multiple",
      });
      const res = mockRes();

      const category = { id: 1, name: "General Knowledge" };
      sinon.stub(categoryRepository, "findById").resolves(category);

      // Stub the fetch call to return API results
      const apiResults = [
        {
          question: "What is the capital of France?",
          correct_answer: "Paris",
          incorrect_answers: ["London", "Berlin", "Madrid"],
        },
        {
          question: "What is 2 + 2?",
          correct_answer: "4",
          incorrect_answers: ["3", "5", "6"],
        },
      ];
      sinon.stub(global, "fetch").resolves({
        json: sinon.stub().resolves({ results: apiResults }),
      });

      const quiz = { id: 1, title: "Sample Quiz", categoryId: 1 };
      sinon.stub(quizRepository, "create").resolves(quiz);
      sinon.stub(questionRepository, "createMany").resolves();

      const quizWithQuestions = {
        id: 1,
        title: "Sample Quiz",
        categoryId: 1,
        questions: [
          {
            id: 1,
            text: "What is the capital of France?",
            correctAnswer: "Paris",
            incorrectAnswers: ["London", "Berlin", "Madrid"],
          },
          {
            id: 2,
            text: "What is 2 + 2?",
            correctAnswer: "4",
            incorrectAnswers: ["3", "5", "6"],
          },
        ],
      };
      sinon.stub(quizRepository, "findById").resolves(quizWithQuestions);

      await createQuiz(req, res);

      expect(res.status.calledOnceWithExactly(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "Quiz successfully created",
        data: quizWithQuestions,
      });


    });

    it("returns 404 when the specified category does not exist", async () => {
      // Write your test code here
      const req = mockReq({
        title: "Sample Quiz",
        categoryId: 999,
        questions: [
          {
            question: "What is the capital of France?",
            correct_answer: "Paris",
            incorrect_answers: ["London", "Berlin", "Madrid"],
          },
        ],
      });
      const res = mockRes();
      sinon.stub(categoryRepository, "findById").resolves(null);
      await createQuiz(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "No category with the id: 999 found",
      });


    });
  });

  // -----------------------------------------------------------------------
  // Read all
  // -----------------------------------------------------------------------
  describe("getQuizzes", () => {
    it("returns 200 and an array of quizzes when quizzes exist", async () => {
      // Write your test code here
      const req = mockReq();
      const res = mockRes();

      const quizzes = [
        { id: 1, title: "Quiz 1", categoryId: 1, questions: [] },
        { id: 2, title: "Quiz 2", categoryId: 1, questions: [] },
      ];

      sinon.stub(quizRepository, "findAll").resolves(quizzes);

      await getQuizzes(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ data: quizzes });

    });

    it("returns 404 when no quizzes exist", async () => {
      // Write your test code here
      const req = mockReq();
      const res = mockRes();

      sinon.stub(quizRepository, "findAll").resolves(null);

      await getQuizzes(req, res);

      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ message: "No quizzes found" });
    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getQuiz", () => {
    it("returns 200 and the quiz when it is found", async () => {
      // Write your test code here
      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      const quiz = { id: 1, title: "Quiz 1", categoryId: 1, questions: [] };
      sinon.stub(quizRepository, "findById").resolves(quiz);

      await getQuiz(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({ data: quiz });
    });

    it("returns 404 when the quiz is not found", async () => {
      // Write your test code here
      const req = mockReq({}, { id: "999" });
      const res = mockRes();

      sinon.stub(quizRepository, "findById").resolves(null);

      await getQuiz(req, res);

      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "No quiz with the id: 999 found",
      });
    });
  });

  // -----------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------
  describe("updateQuiz", () => {
    it("returns 200 and the updated quiz when the quiz exists", async () => {
      // Write your test code here
      const req = mockReq({ title: "Updated Quiz" }, { id: "1" });
      const res = mockRes();

      const quiz = { id: 1, title: "Quiz 1", categoryId: 1, questions: [] };
      const updatedQuiz = { id: 1, title: "Updated Quiz", categoryId: 1, questions: [] };
      sinon.stub(quizRepository, "findById").resolves(quiz);
      sinon.stub(quizRepository, "update").resolves(updatedQuiz);

      await updateQuiz(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "Quiz with the id: 1 successfully updated",
        data: updatedQuiz,
      });
    });

    it("returns 404 when the quiz to update is not found", async () => {
      // Write your test code here
      const req = mockReq({ title: "Updated Quiz" }, { id: "999" });
      const res = mockRes();

      sinon.stub(quizRepository, "findById").resolves(null);

      await updateQuiz(req, res);

      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "No quiz with the id: 999 found",
      });
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteQuiz", () => {
    it("returns 200 when the quiz is found and deleted", async () => {
      // Write your test code here
      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      const quiz = { id: 1, title: "Quiz 1", categoryId: 1, questions: [] };
      sinon.stub(quizRepository, "findById").resolves(quiz);
      sinon.stub(quizRepository, "delete").resolves();

      await deleteQuiz(req, res);

      expect(res.status.calledOnceWithExactly(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "Quiz with the id: 1 successfully deleted",
      });
    });

    it("returns 404 when the quiz to delete is not found", async () => {
      // Write your test code here
      const req = mockReq({}, { id: "999" });
      const res = mockRes();

      sinon.stub(quizRepository, "findById").resolves(null);

      await deleteQuiz(req, res);

      expect(res.status.calledOnceWithExactly(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal({
        message: "No quiz with the id: 999 found",
      });
    });
  });
});
