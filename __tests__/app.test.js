const request = require("supertest");
const app = require("/home/chrisel/assignment3/App.js");

describe("POST /post", () => {
  it("should post user data", async () => {
    const response = await request(app)
      .post("/post")
      .send({ name: "Test User", email: "test@example.com", id: 123 });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Posted");
  });
});

describe("PUT /update/:id", () => {
  it("should update user data", async () => {
    const response = await request(app)
      .put("/update/123")
      .send({ name: "Updated User", email: "updated@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated User");
    expect(response.body.email).toBe("updated@example.com");
  });

  it("should handle non-existent user update", async () => {
    const response = await request(app)
      .put("/update/999")
      .send({ name: "Updated User", email: "updated@example.com" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Nothing found");
  });
});

describe("GET /users", () => {
  it("should retrieve users", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});


