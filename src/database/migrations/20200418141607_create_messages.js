
exports.up = function(knex) {
  return knex.schema.createTable('messages', function(table) {
    table.increments('id').primary();

    table.string('text', 10000).notNullable();
    table.integer('receiver').notNullable();
    table.integer('type').notNullable();

    table.integer('sender').unsigned().notNullable();

    table.timestamps(true, true);

    table.foreign('sender').references('id').inTable('users');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
