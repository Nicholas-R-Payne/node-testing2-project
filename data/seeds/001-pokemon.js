exports.seed = function(knex, Promise) {
    return knex('pokemon')
      .truncate()
      .then(function() {
        return knex('pokemon').insert([
          { name: 'Bulbasaur' },
          { name: 'Charmander' },
          { name: 'Squirtle' },
          { name: 'Pikachu' },
        ]);
      });
  };
  