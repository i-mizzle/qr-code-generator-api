const expect = require('chai').expect;
const request = require("supertest");
const mongoose = require("mongoose");
describe('/Auth-Middleware', () => {
    let server;
    let User;
    let userSchema = { email: "jackrobinson@gmail.com", password: "Abcd1234!" }
    before(async () => {
        server = require("./../../server");
        User = mongoose.model('User');
        await User.deleteMany({});

        const user = new User();
        const password = user.encryptPassword(userSchema.password);
        await User.create({ email: userSchema.email, password: password });
    });
    describe('SignUp#', () => {
        it('should SignUp succesfully if valid Input Passed', async () => {
            const res = await request(server).post('/v1/api/signup').send({ 
                email: "jonu@gmail.com", 
                password: "1234567890", 
                phone: "08012345678",
                name: "John Doe" 
            });
            expect(res.status).to.equal(201);
        })
        it('should return status 409 if username already exists', async () => {
            const res = await request(server).post('/v1/api/signup').send(userSchema);
            expect(res.status).to.equal(409);
        })
    });
    describe('Login#', () => {
        it('should Login with valid credentials', async () => {
            const res = await request(server).post('/v1/api/login').send(userSchema);
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('object').with.a.property('token');
        })
        it('should return 401 if credential are not valid', async () => {
            const res = await request(server).post('/v1/api/login').send({ username: "a@s.com", password: "sss" });
            expect(res.status).to.equal(401);
        })
    });
    after(async () => {
        await User.deleteMany({});
        await server.close();
    })
});
