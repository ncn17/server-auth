import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Generate client auth tokens
 * @param {{}, res} data
 * @returns {token , refreshToken}
 */
const GenerateTokens = (data, res) => {
  const token = jwt.sign(data, process.env.TOKEN_KEY, {
    expiresIn: process.env.TokenTime,
  });

  const refreshToken = jwt.sign(data, process.env.TOKEN_KEY, {
    expiresIn: process.env.RefreshTokenTime,
  });
  // set refreshToken cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    signed: true,
    secure: true,
    partitioned: true,
    maxAge: process.env.RefreshCookieTime,
  });

  return { token, refreshToken };
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

export { GenerateTokens, HashPassword, ComparePassword, DecryptToken };
