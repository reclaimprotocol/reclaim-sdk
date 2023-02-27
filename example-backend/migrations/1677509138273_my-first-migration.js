exports.up = (pgm) => {
    pgm.createTable('submitted_links', {
      id: 'id',
      callback_id: { type: 'varchar(1000)', notNull: true },
      claims: { type: 'TEXT', notNull: false },
      status: { type: 'varchar(20)', notNull: true }
    })
  }