const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app.js'); // Ensure correct path

// Dynamically import Chai if needed
async function loadChai() {
    const chaiModule = await import('chai');
    return chaiModule.default;
}

loadChai().then((chai) => {
    const { expect } = chai;
    chai.use(chaiHttp);

    describe('🌍 API Server Tests', function () {
        it('✅ Should return 200 on the home route', async function () {
            const res = await chai.request(app).get('/');
            expect(res).to.have.status(200);
        });

        it('❌ Should return 404 for an unknown route', async function () {
            const res = await chai.request(app).get('/nonexistent');
            expect(res).to.have.status(404);
        });
    });
});
