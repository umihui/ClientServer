
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('trips', (table) => {
      table.increments('id').primary();
      table.integer('pickup-x');
      table.integer('pickup-y');
      table.integer('dropoff-x');
      table.integer('dropoff-y');
      table.integer('distance');
    }),
    knex.schema.createTable('riders', (table) => {
      table.increments('id').primary();
      table.string('riderid');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('riders'),
    knex.schema.dropTable('trips')
  ])
};
