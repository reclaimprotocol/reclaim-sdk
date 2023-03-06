/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumns('submitted_links', {
      template_id: { type: 'varchar(1000)', notNull: false },
      username: { type: 'varchar(1000)', notNull: false },
    })
  }

exports.down = pgm => {};
