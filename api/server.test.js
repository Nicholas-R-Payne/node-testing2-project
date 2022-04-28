const server = require('./server')
const request = require('supertest')

test('make sure our environment is set correctly', () => {
    expect(process.env.NODE_ENV).toBe('testing');
});

test('server is up', async () => {
    const res = await request(server).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ api: 'up' })
})