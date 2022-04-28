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

    test('update', async () => {
        let result = await Pokemon.update(4, { name: 'Meowth' });
        expect(result).toEqual({ id: 4, name: 'Meowth' });
        result = await Pokemon.getAll();
        expect(result).toHaveLength(4);
    });

    test('remove', async () => {
        let result = await Pokemon.remove(1);
        expect(result).toHaveProperty('name', 'Bulbasaur');
        result = await Pokemon.getAll();
        expect(result).toHaveLength(3);
        expect(result[1].id).toBe(3);
    });
})

describe('HTTP API test', () => {
    test('GET /pokemon', async () => {
        const res = await request(server).get('/pokemon');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(4);
    });

    test('GET /Pokemon/:id', async () => {
        let res = await request(server).get('/pokemon/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, name: 'Bulbasaur' });

        res = await request(server).get('/pokemon/100');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Pokemon not found');
    });

    test('POST /pokemon', async () => {
        let res = await request(server).post('/pokemon').send({ name: 'Pidgey' });
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ id: 5, name: 'Pidgey' });

        let result = await Pokemon.getAll();
        expect(result).toHaveLength(5);

        res = await request(server).post('/pokemon').send({});
        expect(res.status).toBe(500);

        result = await Pokemon.getAll();
        expect(result).toHaveLength(5);
    });

    test('DELETE /pokemon/:id', async () => {
        let res = await request(server).delete('/pokemon/2');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 2, name: 'Charmander' });

        let result = await Pokemon.getAll();
        expect(result).toHaveLength(3);

        res = await request(server).delete('/pokemon/2');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Pokemon not found');

        result = await Pokemon.getAll();
        expect(result).toHaveLength(3);
    });

    test('PUT /pokemon/:id', async () => {
        let res = await request(server).put('/pokemon/3').send({ name: 'Psyduck' });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 3, name: 'Psyduck' });

        let result = await Pokemon.getById(3);
        expect(result).toHaveProperty('name', 'Psyduck');

        result = await Pokemon.getAll();
        expect(result).toHaveLength(4);

        res = await request(server).put('/pokemon/300').send({ name: 'Psyduck' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Pokemon not found');
    });
})