import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";

describe("Auth Routes", () => {
  // ===============================
  // DB SETUP
  // ===============================
  beforeAll(async () => {
    process.env.NODE_ENV = "test";

    const mongoURI =
      process.env.MONGO_URI_TEST || process.env.MONGO_URI;

    await mongoose.connect(mongoURI);
  });

  // ===============================
  // CLEAN DATABASE AFTER EACH TEST
  // ===============================
  afterEach(async () => {
    await User.deleteMany({});
  });

  // ===============================
  // CLOSE DB CONNECTION
  // ===============================
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // ===============================
  // TEST 1: REGISTER SUCCESS
  // ===============================
  test("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("testuser@example.com");
  });

  // ===============================
  // TEST 2: DUPLICATE EMAIL
  // ===============================
  test("should fail to register with an existing email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "User One",
      email: "existing@example.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User Two",
        email: "existing@example.com",
        password: "password456",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // ===============================
  // TEST 3: MISSING FIELDS
  // ===============================
  test("should fail with missing required fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Incomplete User",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // ===============================
  // TEST 4: LOGIN SUCCESS
  // ===============================
  test("should log in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  // ===============================
  // TEST 5: LOGIN FAILURE
  // ===============================
  test("should fail to login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Wrong Pass User",
      email: "wrongpass@example.com",
      password: "correctpassword",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrongpass@example.com",
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});