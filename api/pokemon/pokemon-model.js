const db = require('../../data/db-config')

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}

function getAll() {
  return db('pokemon')
}

function getById(id) {
  return db('pokemon')
    .where('id', id)
    .first();
}

async function insert(hobbit) {
  return db('pokemon')
    .insert(hobbit)
    .then(([id]) => getById(id));
}

async function update(id, changes) {
  return db('pokemon')
    .update(changes)
    .where('id', id)
    .then(() => getById(id));
}

async function remove(id) {
  const result = await getById(id);
  await db('pokemon').del().where('id', id);
  return result;
}
