// Allowed roles for role validation.
const VALID_ROLES = ['student', 'faculty', 'admin'];

// Checks basic email format.
const isValidEmail = (email) => typeof email === 'string' && /\S+@\S+\.\S+/.test(email);
// Ensures email belongs to the institution domain.
const isInstitutionEmail = (email) => typeof email === 'string' && email.endsWith('@ietdavv.edu.in');
// Enforces minimum password strength rules.
const isStrongPassword = (password) => typeof password === 'string' && password.length >= 8;
// Validates role against allowed values.
const isValidRole = (role) => VALID_ROLES.includes(role);

// Returns required fields that are missing or empty.
const getMissingFields = (payload, fields = []) => {
  return fields.filter((field) => payload?.[field] === undefined || payload?.[field] === null || payload?.[field] === '');
};

module.exports = {
  VALID_ROLES,
  isValidEmail,
  isInstitutionEmail,
  isStrongPassword,
  isValidRole,
  getMissingFields
};
