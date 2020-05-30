
exports.up = function(knex) {
    return knex.schema.alterTable('messages', function(table) {
        table.integer('read').default(1);
        table.integer('read').defaultTo(0).alter();
    });
};

exports.down = function(knex) {
    return knex.schema.table('messages', function(table) {
        table.dropColumn('read');
    });
};
