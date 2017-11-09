
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('requests'),
    knex.schema.createTable('requests', (table) => {
      table.increments('id').primary();
      table.string('rider_id').references('id').inTable('riders').notNull();
      table.integer('pickup-x');
      table.integer('pickup-y');
      table.integer('dropoff-x');
      table.integer('dropoff-y');
      table.integer('distance');
      table.decimal('base-price');
      table.decimal('final-price').nullable();
      table.decimal('surge-ratio', 3, 1).nullable();
      table.integer('zone');
      table.enum('status',['pending', 'accepted', 'cancelled']);
      table.timestamp('created_at');
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('requests'),
  ]);
};
