import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Create jwt token
 * @param {object} data
 * @param {string} key
 * @param {string} expireDate
 * @returns string of json token
 */
const CreateToken = (data, key, expireDate) => {
  return jwt.sign(data, key, { algorithm: 'HS256' }, { expiresIn: expireDate });
};

/**
 * Hash password with good value
 * @param {string} password
 * @returns passwordHashed
 */
const HashPassword = async (password) =>
  await bcrypt.hash(password, process.env.PASSWORD_SALT);

/**
 * Compare two password
 * @param {string} plainTextPassword
 * @param {string} hash
 * @returns boolean
 */
const ComparePassword = async (plainTextPassword, hash) =>
  await bcrypt.compare(plainTextPassword, hash);

export { CreateToken, HashPassword, ComparePassword };
