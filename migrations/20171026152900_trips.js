
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('requests', (table) => {
      table.increments('id').primary();
      table.integer('rider_id').references('id').inTable('riders').notNull();
      table.integer('pickup-x');
      table.integer('pickup-y');
      table.integer('dropoff-x');
      table.integer('dropoff-y');
      table.integer('distance');
      table.decimal('finalPrice');
      table.integer('zone');
      table.boolean('confirm');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('requests')
  ])
};
