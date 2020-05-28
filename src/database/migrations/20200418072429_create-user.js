
exports.up = function(knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();

    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('name').notNullable();

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
