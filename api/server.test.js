const server = require('./server')
const request = require('supertest')
const db = require('../data/db-config')
const Pokemon = require('./pokemon/pokemon-model')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
});

beforeEach(async () => {
    await db('pokemon').truncate();
    await db('pokemon')
        .insert([
            { name: 'Bulbasaur' },
            { name: 'Charmander' },
            { name: 'Squirtle' },
            { name: 'Pikachu' }
        ])
});

afterAll(async () => {
    await db.destroy()
})

test('server is up', async () => {
    const res = await request(server).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ api: 'up' })
})

describe('database tests', () => {
    test('getAll', async () => {
        const result = await Pokemon.getAll();
        expect(result.constructor.name).toBe('Array');
        expect(result.length).toBe(4);
        expect(result[1]).toMatchObject({ name: 'Charmander' });
    });

    test('insert', async () => {
        let result = await Pokemon.insert({ name: 'Eevee' });
        expect(result).toHaveProperty('name', 'Eevee');
        expect(result.id).toBe(5);
        result = await Pokemon.getAll();
        expect(result.length).toBe(5);
    });

    test('getById', async () => {
        let result = await Pokemon.getById(0);
        expect(result).not.toBeDefined();
        result = await Pokemon.getById(1);
        expect(result).toBeDefined();
        expect(result.name).toBe('Bulbasaur');
    });
})