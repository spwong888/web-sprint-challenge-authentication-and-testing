const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

const user = {
  username: "Captain Marvel",
  password: "foobar"
};

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})


test('sanity', () => {
  expect(true).toBe(true)
})


describe('Test endpoints', () => {
  describe("[POST] /api/auth/register", () => {
    test("user can register", async () => {
      let res;
      res = await request(server).post("/api/auth/register").send(user);
      expect(res.status).toBe(201);
    });
    it("adds the user to the database", async () => {
      let res;
      await request(server).post("/api/auth/register").send(user);
      res = await db('users')
        .where({ id: 1 })
        .first();
      expect(res.username).toBe(user.username);
    });
    it("rejects username if taken", async () => {
      let res;
      await request(server).post("/api/auth/register").send(user);

      res = await request(server).post("/api/auth/register").send(user);
      expect(res.status).toBe(401);
      expect(res.text).toMatch(/.*username taken.*/);
    });
    it("requires username and password", async () => {
      let res;
      res = await request(server)
        .post("/api/auth/register")
        .send({password: "foobar"});
      expect(res.text).toMatch(/.*username and password required.*/);

      res = await request(server)
        .post("/api/auth/register")
        .send({username: "Captain Marvel"});
      expect(res.text).toMatch(/.*username and password required.*/);
    });
  describe("[POST] /api/auth/login", () => {
    it("requires username and password", async () => {
      let res;
      res = await request(server)
        .post("/api/auth/login")
        .send({password: "foobar"});
      expect(res.text).toMatch(/.*username and password required.*/);

      res = await request(server)
        .post("/api/auth/login")
        .send({username: "Captain Marvel"});
      expect(res.text).toMatch(/.*username and password required.*/);
    });
    it("checks if username exists", async () => {
      let res;
      res = await request(server)
        .post("/api/auth/login")
        .send(user);
        expect(res.text).toMatch(/.*invalid credentials.*/);
    })
    it("checks if password is correct", async () => {
      let res;
      await request(server)
        .post("/api/auth/register")
        .send(user);
      res = await request(server)
        .post("/api/auth/login")
        .send({...user, password: "bad_password"});
        expect(res.text).toMatch(/.*invalid credentials.*/);
    });
    it("logs in with valid credentials", async () => {
      let res;
      await request(server)
        .post("/api/auth/register")
        .send(user);
      res = await request(server)
        .post("/api/auth/login")
        .send(user);
      expect(res.text).toMatch(/.*welcome.*token.*/);
    });
  });
  })
})