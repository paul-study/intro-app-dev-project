// Write your import code here
import sinon from "sinon";

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
        questions: [
          {
            question: "What is the capital of France?",
            correct_answer: "Paris",
            incorrect_answers: ["London", "Berlin", "Madrid"],
          },
        ],
      });
      const res = mockRes();

      const category = { id: 1, name: "General Knowledge" };
      sinon.stub(categoryRepository, "findById").resolves(category);

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
        ],
      };
      sinon.stub(quizRepository, "findById").resolves(quizWithQuestions); 

      await createQuiz(req, res);

      expect(res.status.calledOnceWith(201)).to.be.true;
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
    });

    it("returns 404 when no quizzes exist", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getQuiz", () => {
    it("returns 200 and the quiz when it is found", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz is not found", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------
  describe("updateQuiz", () => {
    it("returns 200 and the updated quiz when the quiz exists", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz to update is not found", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteQuiz", () => {
    it("returns 200 when the quiz is found and deleted", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz to delete is not found", async () => {
      // Write your test code here
    });
  });
});
