import supertest from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
import express from "express"; 

const app = express();

dotenv.config({ path: ".env.test" });
 

const requester = supertest(`http://${process.env.DOMAIN}:${process.env.PORT}`);

describe("Carts API Tests", function () {
    this.timeout(10000);

    let adminToken = "";
    let userToken = "";
    let testCartId = "";
    let testProductId = "67d25e83aa42ea34f74b75ed"; // Replace with a valid product ID

    // before(function (done) {

    //     // Authenticate as User
    //     requester
    //         .post(`/api/sessions/`)
    //         .send({
    //             email: "user_1737943046485@example.com",
    //             password: "pass123",
    //         })
    //         .set('Content-Type', 'application/json')
    //         .end(function (err, res) {
    //             console.log(res.body.token);
    //             if (err) return done(err);
    //             expect(res.status).to.equal(200);
    //             userToken = res.body.token;
    //             expect(userToken).to.exist;
    //             console.log(" User Token Retrieved");

    //         });
    // });

    describe("✅ Cart Management", function () {
        it("✅ Should create a new cart for the authenticated user", function (done) {
            requester
                .post(`/api/carts/`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(201);
                    expect(res.body).to.have.property("_id");

                    testCartId = res.body._id;
                    console.log("🛒 Created Test Cart:", testCartId);
                    done();
                });
        });

        it("✅ Should retrieve a cart by ID", function (done) {
            requester
                .get(`/api/carts/${testCartId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property("_id").that.equals(testCartId);
                    done();
                });
        });

        it("✅ Should retrieve the authenticated user's cart", function (done) {
            requester
                .get(`/carts/my-cart`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property("_id");
                    done();
                });
        });
    });

    describe("🛍️ Cart Operations", function () {
        it("✅ Should add a product to the cart", function (done) {
            requester
                .post(`/api/carts/${testCartId}/product/${testProductId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(201);
                    expect(res.body.message).to.equal("Producto añadido al carrito");
                    done();
                });
        });

        it("✅ Should remove a product from the cart", function (done) {
            requester
                .delete(`/api/carts/${testCartId}/product/${testProductId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.message).to.equal("✅ Producto eliminado del carrito");
                    done();
                });
        });
    });

    describe("💳 Checkout Process", function () {
        it("✅ Should allow checkout of a cart", function (done) {
            requester
                .post(`/api/carts/${testCartId}/checkout`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property("message").that.includes("Compra realizada con éxito");
                    done();
                });
        });
    });


});
