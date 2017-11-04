// Update with your config settings.

module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'umihui',
      password: '',
      database: 'uber-test'
    },
    debug: true,
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './database/seeds/test'
    }
  },

  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'umihui',
      password: '',
      database: 'uber'
    },
    debug: true,
    migrations: {
      directory: './migrations'
    }
  }

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },
  //
  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },

// }

};
