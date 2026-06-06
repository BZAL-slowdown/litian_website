import { describe, it } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { createApp } from "./app.js";
import { createDatabase } from "./db.js";

function testApp() {
  process.env.ADMIN_USERNAME = "admin";
  process.env.ADMIN_PASSWORD = "secret123";
  process.env.JWT_SECRET = "test-secret-for-litian";
  const db = createDatabase(":memory:");
  return createApp({ db });
}

describe("Litian API", () => {
  it("serves seeded public content", async () => {
    const app = testApp();
    const res = await request(app).get("/api/public/site").expect(200);
    assert.ok(res.body.pages.length >= 20);
    assert.ok(res.body.cases.length >= 1);
  });

  it("allows admin login and page update", async () => {
    const app = testApp();
    const login = await request(app).post("/api/auth/login").send({ username: "admin", password: "secret123" }).expect(200);
    const token = login.body.token;
    await request(app)
      .put("/api/admin/pages/home")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "测试首页",
        subtitle: "测试副标题",
        summary: "测试摘要",
        category: "测试",
        sections: [{ heading: "段落", body: "正文" }],
        is_published: true,
        sort_order: 1
      })
      .expect(200);
    const page = await request(app).get("/api/public/pages/home").expect(200);
    assert.equal(page.body.title, "测试首页");
  });
});
