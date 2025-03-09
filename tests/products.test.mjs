import supertest from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const requester = supertest(app);

describe("📌 Products API Tests (Using Supertest)", function () {
  this.timeout(10000); // Extend timeout for database operations

  let adminToken = "";
  let testProductId = "";

  before(async function () {
    // ✅ Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // ✅ Login as admin to get token
    const adminCredentials = {
      email: "user_1738278644990@example.com",
      password: "$2b$10$U1buLodDHyE8RzLcnS93BupQInEI9G5bZdy4aonPvwjuznn8l2gdG",
    };

    const loginResponse = await requester.post("/api/session/login").send(adminCredentials);
    expect(loginResponse.status).to.equal(200);
    adminToken = loginResponse.body.token; // Store the token for authenticated requests
  });

  after(async function () {
    // ✅ Disconnect from MongoDB after tests
    await mongoose.disconnect();
  });


  it("✅ Should create a new product as an admin", async function () {
    const newProduct = {
      title: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 10,
      category: "test-category",
    };

    const res = await requester
      .post("/api/products/")
      .set("Authorization", `Bearer ${adminToken}`) // ✅ Admin authentication
      .send(newProduct);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");

    // Store the created product ID for deletion test
    testProductId = res.body._id;
  });

  it("✅ Should return a product by ID", async function () {
    const res = await requester.get(`/api/products/${testProductId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id").that.equals(testProductId);
  });

  it("❌ Should not allow adding a product without admin role", async function () {
    const newProduct = {
      title: "Unauthorized Product",
      description: "This should fail",
      price: 50,
      stock: 5,
      category: "unauthorized-category",
    };

    const res = await requester.post("/api/products").send(newProduct);

    expect(res.status).to.equal(403); // Expect Forbidden
  });

  it("✅ Should delete a product by ID as an admin", async function () {
    const res = await requester
      .delete(`/api/products/${testProductId}`)
      .set("Authorization", `Bearer ${adminToken}`); // ✅ Authenticated deletion

    expect(res.status).to.equal(200);
  });
});
