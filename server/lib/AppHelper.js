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
  return jwt.sign(data, key, { expiresIn: expireDate });
};

/**
 * Generate client auth tokens
 * @param {{}} data
 * @returns {token , refreshToken}
 */
const GenerateTokens = (data) => {
  return {
    token: CreateToken(data, process.env.TOKEN_KEY, 5 * 60),
    refreshToken: CreateToken(
      data,
      process.env.REFRESH_TOKEN_KEY,
      15 * 60 * 60
    ),
  };
};

/**
 * Decode jwt token
 * @param {string} token
 * @param {string} key
 * @returns object of decode values
 */
const DecryptToken = (token, key, callBack) => {
  jwt.verify(token, key, async (err, decoded) => await callBack(err, decoded));
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

export {
  CreateToken,
  GenerateTokens,
  HashPassword,
  ComparePassword,
  DecryptToken,
};
