import supertest from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";


dotenv.config({ path: ".env.test" });
console.log(`${process.env.DOMAIN}:${process.env.PORT}`);
const requester = supertest(`${process.env.DOMAIN}:${process.env.PORT}`);


let authToken = "";
let testUser = {
    first_name: "Test",
    last_name: "User",
    email: `testuser_${Date.now()}@mail.com`,
    password: "SecurePass123",
    age: 30,
    role: "user"
};

describe("Users API Tests", function () {

    it("✅ Should register a new user", function (done) {
        requester.post("/api/sessions/register")
            .send(testUser)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property("message").that.equals("Usuario registrado exitosamente");
                done();
            });
    });

    it("✅ Should log in and return a JWT token", function (done) {
        requester.post("/api/sessions/")
            .send({ email: testUser.email, password: testUser.password })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property("token");
                authToken = res.body.token; // Store JWT for later tests
                done();
            });
    });

    it("✅ Should retrieve the current user session", function (done) {
        requester.get("/api/sessions/current")
            .set("Cookie", `tokenCookie=${authToken}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property("user");
                expect(res.body.user).to.have.property("email").that.equals(testUser.email);
                done();
            });
    });

    it("❌ Should NOT access protected route without authentication", function (done) {
        requester.get("/api/sessions/current")
            .expect(401)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property("error").that.equals("No autenticado");
                done();
            });
    });

});
