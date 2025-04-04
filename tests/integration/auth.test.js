const request = require("supertest");
const app = require("../../app");
const { setupDB, teardownDB, clearDB } = require("../fixtures/db-setup");
const { testUserCredentials } = require("../fixtures/users");
const jwt = require("jsonwebtoken");
const User = require("../../domains/user.model");

let adminToken = "";
let userToken = "";

beforeAll(async () => {
  await setupDB();
});

afterAll(async () => {
  await teardownDB();
});

describe("Authentication API", () => {
  describe("POST /api/v1/login", () => {
    test("should login admin user and return tokens", async () => {
      const response = await request(app)
        .post("/api/v1/login")
        .send({
          username: testUserCredentials.admin.username,
          password: testUserCredentials.admin.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("access_token");

      adminToken = response.body.data.access_token;

      // Verify token has admin claim
      const decodedToken = jwt.decode(adminToken);
      expect(decodedToken).toHaveProperty("is_admin", true);
    });

    test("should login regular user and return tokens", async () => {
      const response = await request(app)
        .post("/api/v1/login")
        .send({
          username: testUserCredentials.user.username,
          password: testUserCredentials.user.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("access_token");

      userToken = response.body.data.access_token;

      // Verify token does not have admin claim
      const decodedToken = jwt.decode(userToken);
      expect(decodedToken).toHaveProperty("is_admin", false);
    });

    test("should return 401 with invalid credentials", async () => {
      await request(app)
        .post("/api/v1/login")
        .send({
          username: "wrong@example.com",
          password: "wrongpassword",
        })
        .expect(401); // Now should return 401 for both invalid username and invalid password
    });
  });

  describe("POST /api/v1/refresh-token", () => {
    test("should refresh admin token", async () => {
      // For testing purposes, we need to get the refresh token from the database
      const adminUser = await User.findOne({
        username: testUserCredentials.admin.username,
      });
      const adminRefreshToken = adminUser.refresh_token;

      const response = await request(app)
        .post("/api/v1/refresh-token")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          refresh_token: adminRefreshToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("access_token");

      // Update admin token for future tests
      adminToken = response.body.data.token;
    });

    test("should refresh user token", async () => {
      // For testing purposes, we need to get the refresh token from the database
      const regularUser = await User.findOne({
        username: testUserCredentials.user.username,
      });
      const userRefreshToken = regularUser.refresh_token;

      const response = await request(app)
        .post("/api/v1/refresh-token")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          refresh_token: userRefreshToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("access_token");

      // Update user token for future tests
      userToken = response.body.data.access_token;
    });

    test("should return 401 with invalid refresh token", async () => {
      await request(app)
        .post("/api/v1/refresh-token")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          refresh_token: "invalid-refresh-token",
        })
        .expect(401);
    });
  });

  describe("GET /api/v1/profile", () => {
    test("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/v1/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
    });

    test("should return 401 without token", async () => {
      await request(app).get("/api/v1/profile").expect(401);
    });

    test("should return 401 with invalid token", async () => {
      await request(app)
        .get("/api/v1/profile")
        .set("Authorization", "Bearer invalidtoken")
        .expect(401);
    });
  });
});
