const { query } = require('../config/db');

// Returns departments ordered by name.
const getDepartments = async () => {
  return query('SELECT id, name, code FROM departments ORDER BY name');
};

module.exports = {
  getDepartments
};
