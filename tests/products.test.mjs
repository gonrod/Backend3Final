
import supertest from "supertest";
import { expect } from "chai";
import http from "http";
import app from "../src/app.js"; // Importamos app sin levantar el servidor
import config from "../src/config.js";

let requester;
let server;

describe("🛍️ Products API Tests", function () {
    this.timeout(10000);

    let userToken = "";
    let adminToken = "";
    let testProductId = "67d67166899d446acfb7cb98";

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

    // 🔹 Login del usuario normal antes de sus tests
    describe("🚫 Unauthorized Actions (Usuarios normales no pueden modificar productos)", function () {
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

        it("❌ No debería permitir a un usuario normal agregar un producto", function (done) {
            const newProduct = {
                title: "Unauthorized Product",
                description: "This should fail",
                price: 50,
                stock: 5,
                category: "unauthorized-category"
            };

            requester
                .post(`/api/products/`)
                .set("Authorization", `Bearer ${userToken}`)
                .send(newProduct)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(403); // Expected Forbidden
                    done();
                });
        });

        it("❌ No debería permitir a un usuario normal eliminar un producto", function (done) {
            requester
                .delete(`/api/products/${testProductId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(403); // Expected Forbidden
                    done();
                });
        });
    });

    // 🔹 Login del admin antes de sus tests
    describe("🛠️ Admin Actions (Requieren Autenticación)", function () {
        let newProductId = "";

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

        it("✅ Debería permitir a un admin agregar un producto", function (done) {
            const newProduct = {
                title: "Test Product",
                description: "Test description",
                price: 100,
                stock: 10,
                category: "test-category"
            };

            requester
                .post(`/api/products/`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send(newProduct)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(201);
                    expect(res.body).to.have.property("_id");
                    newProductId = res.body._id;
                    done();
                });
        });

        it("✅ Debería permitir a un admin eliminar un producto", function (done) {
            requester
                .delete(`/api/products/${newProductId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(204);
                    done();
                });
        });
    });

    describe("✅ Public Routes (Accessible by Everyone)", function () {
        it("✅ Debería devolver todos los productos sin autenticación", function (done) {
            requester
                .get(`/api/products/`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.header["content-type"]).to.match(/json/);
                    done();
                });
        });
    });
});

