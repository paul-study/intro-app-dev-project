import { describe, it } from "node:test";
import assert from "node:assert/strict";
import supertest from "supertest";
import app from "../app.js";

const request = supertest(app);

describe("Catch-all 404", () => {
  it("returns 404 for an unknown GET route", async () => {
    const res = await request.get("/api/nonexistent");
    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Route not found");
  });

  it("returns 404 for an unknown nested route", async () => {
    const res = await request.get("/api/users/does/not/exist/deeply");
    assert.equal(res.status, 404);
  });
});