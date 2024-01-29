// Write your tests here

const request = require('supertest')
const server = require('../api/server')
const db = require('../data/dbConfig')

const dbUserA = { username: 'user1', password: '$2a$08$0Oy2My7wUA9iEpKiNZ52nuwzFN0pj8B6VX61pJIEaYw0tE5OmQ2Da' }
const apiUserA = { username: 'user1', password: 'hello' }

afterAll(async () => {
  await db.destroy()
})
beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})


describe('register', () => {
//test register
  test('can register', async () => {
    const res = await request(server).post('/api/auth/register').send(apiUserA);
    expect(res.body.id).toEqual(1)
  })

  test('cant register, missing username', async () => {
    const res = await request(server).post('/api/auth/register').send({
      password: 'fake'
    });
    expect(res.status).toEqual(400)
  })
});

describe('login', ()=>{
  beforeEach(async () => {
    await db('users').insert(dbUserA)
  })

  test('can login', async () => {
    const res = await request(server).post('/api/auth/login').send(apiUserA);
    expect(res.body.token).not.toBeNull();
  })

  test('fail login, missing password', async () => {
    const res = await request(server).post('/api/auth/login').send({username: 'user1'});
    expect(res.statusCode).toEqual(400)
  })

  test('fail login, invalid password', async () => {
    const res = await request(server).post('/api/auth/login').send({username: 'user1', password: 'asdfasdf'});
    expect(res.statusCode).toEqual(401)
  })
})

describe('jokes', () => {

  beforeEach(async () => {
    await db('users').insert(dbUserA)
  })

  test('can get jokes', async () => {
    const res = await request(server).post('/api/auth/login').send(apiUserA);
    const jokesRes = await request(server).get('/api/jokes').set('Authorization', res.body.token);
    expect(jokesRes.body).not.toBeNull();
    expect(jokesRes.body.length).toBeTruthy();
  })

  test('cant get jokes, missing token', async () => {
    const jokesRes = await request(server).get('/api/jokes');
    expect(jokesRes.statusCode).toEqual(401)
  })
});


test('sanity', () => {
  expect(true).toBe(true)
})