import supertest from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

const requester = supertest(app);

describe("🔐 Sessions API Tests", function () {
    this.timeout(10000);

    let userToken = "";
    let resetToken = "";
    const testUser = {
        first_name: "Test",
        last_name: "User",
        email: `testuser_${Date.now()}@example.com`,
        password: "test123",
        role: "user",
        age: 25
    };

    describe("📝 Registro de usuario", function () {
        it("✅ Debería registrar un nuevo usuario", function (done) {
            requester
                .post(`/api/sessions/register`)
                .send(testUser)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(201);
                    expect(res.body).to.have.property("message").that.includes("Usuario registrado exitosamente");
                    done();
                });
        });
    });

    describe("🔑 Inicio de sesión", function () {
        it("✅ Debería iniciar sesión con credenciales correctas", function (done) {
            requester
                .post(`/api/sessions/`)
                .send({ email: testUser.email, password: testUser.password })
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property("token");
                    userToken = res.body.token;
                    done();
                });
        });

        it("❌ No debería iniciar sesión con credenciales incorrectas", function (done) {
            requester
                .post(`/api/sessions/`)
                .send({ email: testUser.email, password: "wrongpassword" })
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(401);
                    done();
                });
        });
    });

    describe("👤 Sesión actual", function () {
        it("✅ Debería obtener la sesión actual del usuario autenticado", function (done) {
            requester
                .get(`/api/sessions/current`)
                .set("Authorization", `Bearer ${userToken}`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property("user");
                    expect(res.body.user).to.have.property("email").that.equals(testUser.email);
                    done();
                });
        });

        it("❌ No debería obtener la sesión actual sin autenticación", function (done) {
            requester
                .get(`/api/sessions/current`)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(401);
                    done();
                });
        });
    });

    describe("🔄 Recuperación de contraseña", function () {
        it("✅ Debería solicitar un enlace de recuperación de contraseña", function (done) {
            requester
                .post(`/api/sessions/forgot-password`)
                .send({ email: testUser.email })
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it("✅ Debería permitir restablecer la contraseña con un token válido", function (done) {
            requester
                .post(`/api/sessions/reset-password/${resetToken}`)
                .send({ newPassword: "newpassword123" })
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it("❌ No debería permitir restablecer la contraseña con un token inválido", function (done) {
            requester
                .post(`/api/sessions/reset-password/invalidtoken`)
                .send({ newPassword: "newpassword123" })
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });
});
