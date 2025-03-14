import supertest from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
const requester = supertest(`${process.env.DOMAIN}:${process.env.PORT}`);


describe(" Products API Tests", function () {
   
    let newProduct = {
        title: "Unauthorized Product",
        description: "This should fail",
        price: 50,
        stock: 5,
        category: "unauthorized-category",
    };

    let testProductId = "67d25e83aa42ea34f74b75ed";

    describe("✅ Public Routes (Accessible by Everyone)", function () {
        it("✅ Should return all products", async function () {
            requester.get("/api/products")
                .expect(200)
                .expect('Content-Type', 'application/json')
                .end(function(err, res) {
                    if (err) throw err;
                });
            
           
        });
        it("✅ Should return a product by ID", async function () {
            requester.get(`/api/products/${testProductId}`)
                .expect(200)
                .expect('Content-Type', 'application/json')
                .end(function(err, res) {  
                    if (err) throw err;
                    expect(res.body).to.have.property("_id").that.equals(testProductId);
                });
        });
    });

    describe("Attempting Unauthorized Actions", function () {
        it("Should NOT allow a normal user to add a product", async function () {
            requester.post(`/api/products/`)
                .send(newProduct)
                .end(function(err, res) {  
                    if (err) throw err;
                    expect(res.status).to.equal(403); // Expected Forbidden
                });
        });

        it("Should NOT allow a normal user to delete a product", async function () {
            requester.delete(`/api/products/${testProductId}`)
                .end(function (err, res) {
                    if (err) return done(err); // Proper error handling
                    expect(res.status).to.equal(403); // Expected Forbidden
                });
        });

        it("Should not allow an admin to update a product", async function () {
            const updatedData = { price: 120, stock: 20 };

            requester.put(`/api/products/${testProductId}`)
                .send(updatedData)
                .end(function (err, res) {
                    if (err) return done(err); // Proper error handling
                    expect(res.status).to.equal(403); // Expected Forbidden
                });

        });
    });
});
