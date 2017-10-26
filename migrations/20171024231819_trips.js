
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('trips', (table) => {
      table.increments('id').primary();
      table.uuid('rider_id');
      table.integer('pickup-x');
      table.integer('pickup-y');
      table.integer('dropoff-x');
      table.integer('dropoff-y');
      table.integer('distance');
    }),
    knex.schema.createTable('test', (table) => {
      table.increments('id').primary();
      table.string('name');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('trips')
  ])
};
