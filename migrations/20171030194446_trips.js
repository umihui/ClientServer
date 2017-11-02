
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
      table.string('id').primary();
      table.string('type');
      table.json('profile');
    }),  
    knex.schema.createTable('surge-update-log', (table) => {
      table.increments('id').primary();
      table.integer('zone');
      table.decimal('surge-ratio',3 , 1);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('requests', (table) => {
      table.increments('id').primary();
      table.string('rider_id').references('id').inTable('riders').notNull();
      table.integer('pickup-x');
      table.integer('pickup-y');
      table.integer('dropoff-x');
      table.integer('dropoff-y');
      table.integer('distance');
      table.decimal('final-price').nullable();
      table.decimal('surge-ratio', 3, 1);
      table.integer('zone');
      table.timestamp('created_at');
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('trips'),
    knex.schema.dropTable('requests'),
    knex.schema.dropTable('riders'),
    knex.schema.dropTable('surge-update-log'),
  ]);
};
