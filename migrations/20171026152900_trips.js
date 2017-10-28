exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('requests', (table) => {
      table.increments('id').primary();
      table.integer('rider_id').references('id').inTable('riders').notNull();
      table.integer('pickup-x');
      table.integer('pickup-y');
      table.integer('dropoff-x');
      table.integer('dropoff-y');
      table.integer('distance');
      table.decimal('final-price');
      table.decimal('surge-ratio');
      table.integer('zone');
      table.boolean('confirm');
      table.timestamp('created_at');
    }),
    knex.schema.createTable('surge-update-log', (table) => {
      table.increments('id').primary();
      table.integer('zone');
      table.decimal('surge-ratio');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('requests'),
    knex.schema.dropTable('surge-update-log'),
  ]);
};
