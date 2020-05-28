
exports.up = function(knex) {
  return knex.schema.createTable('friendships', function (table) {
      table.increments('id').primary();

      table.integer('user_requested').notNullable();
      table.integer('user_action').notNullable();
      table.integer('status').notNullable();
      table.integer('requesterId').unsigned().notNullable();

      table.timestamps(true, true);

      table.foreign('requesterId').references('id').inTable('users');

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('friendships');
};
