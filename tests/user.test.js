const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/users')
const { userOneId, userOne, setUpDatabase } = require('./fixtures/db')

beforeEach(setUpDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Barbossa',
        email: 'barbossa.blackpearl@pirates.com',
        password: 'bblackpearl'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Barbossa',
            email: 'barbossa.blackpearl@pirates.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('bblackpearl')
})

test('Should log in a existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    
    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })
})

test('Should not log in incorrect user', async () => {
    await request(app).post('/users/login').send({
        email:'barbossa.blackpearl@pirates.com',
        password: 'bblackpearlp'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/profile')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
    
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/profile')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/user/profilePic')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/jack_sparrow.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            age: 24
        })
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.age).toEqual(24)
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            ship: 'Black Pearl'
        })
        .expect(400)
})