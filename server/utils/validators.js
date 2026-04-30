const VALID_ROLES = ['student', 'faculty', 'admin'];

const isValidEmail = (email) => typeof email === 'string' && /\S+@\S+\.\S+/.test(email);
const isInstitutionEmail = (email) => typeof email === 'string' && email.endsWith('@ietdavv.edu.in');
const isStrongPassword = (password) => typeof password === 'string' && password.length >= 8;
const isValidRole = (role) => VALID_ROLES.includes(role);

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
