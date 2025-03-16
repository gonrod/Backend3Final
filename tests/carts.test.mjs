import supertest from "supertest";
import { expect } from "chai";
import http from "http";
import app from "../src/app.js"; // Importamos app sin levantar el servidor
import config from "../src/config.js";

let requester;
let server;

describe("🛒 Carts API Tests", function () {
    this.timeout(10000);

    let userToken = "";
    let adminToken = "";
    let testCartId = "";
    let testProductId = "67d25e83aa42ea34f74b75ed";

    // 🔹 Iniciar un servidor de pruebas antes de correr los tests
    before(function (done) {
        server = http.createServer(app);
        server.listen(config.port || 3001, () => {
            console.log(`🚀 Servidor de pruebas corriendo en http://localhost:${config.port || 3001}`);
            requester = supertest.agent(server);
            done();
        });
    });

    // 🔹 Cerrar el servidor de pruebas al terminar los tests
    after(function (done) {
        server.close(done);
    });
    
    // Login del admin
    before(function (done) {
        requester
            .post(`/api/sessions/`)
            .send({
                email: "user_1738197556304@example.com",
                password: "pass123" 
            })
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property("token");
                adminToken = res.body.token;
                done();
            });
    });
    
    //  Login del usuario normal
    before(function (done) {
        requester
            .post(`/api/sessions/`)
            .send({
                email: "user_1737943046485@example.com",  // Usuario normal
                password: "pass123"
            })
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property("token");
                userToken = res.body.token;
                done();
            });
    });
    

    describe("✅ Cart Management", function () {
        it("✅ Should retrieve the authenticated user's cart", function (done) {
            requester
                .get(`/api/carts/my-cart`)
                .set("Authorization", `Bearer ${userToken}`)
                .redirects(0)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property("cartId");  // ✅ Ahora validamos `cartId`
                    testCartId = res.body.cartId;  // ✅ Guardamos el `cartId` para usarlo en los siguientes tests
                    done();
                });
        });
    });

    describe("🛍️ Cart Operations", function () {
        it("✅ Debería agregar un producto al carrito", function (done) {
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

        it("✅ Debería eliminar un producto del carrito", function (done) {
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
        before(function (done) {
    
            requester
                .get(`/api/carts/${testCartId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    
                    if (res.body.products.length === 0) {
                        requester
                            .post(`/api/carts/${testCartId}/product/${testProductId}`)
                            .set("Authorization", `Bearer ${userToken}`)
                            .end(function (err, res) {
                                if (err) return done(err);
                                expect(res.status).to.equal(201);
                                expect(res.body.message).to.equal("Producto añadido al carrito");
                                done();
                            });
                    } else {
                        done();
                    }
                });
        });
    
        let generatedTicketId = null;
    
        // 🔹 1️⃣ Ejecutar compra y verificar que se genera un ticket
        it("✅ Debería permitir la compra del carrito y generar un ticket", function (done) {
            requester
                .post(`/api/carts/${testCartId}/checkout`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property("message").that.includes("Compra realizada con éxito");
                    expect(res.body).to.have.property("ticket");
    
                    generatedTicketId = res.body.ticket._id;
                    done();
                });
        });
    
        // 🔹 2️⃣ Validar la estructura del ticket generado
        it("✅ Debería recuperar el ticket generado después de la compra", function (done) {
            requester
                .get(`/api/tickets/${generatedTicketId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property("code").that.is.a("string");
                    expect(res.body).to.have.property("totalAmount").that.is.a("number");
                    expect(res.body).to.have.property("products").that.is.an("array").and.not.empty;
                    done();
                });
        });
    });
    
    
});
